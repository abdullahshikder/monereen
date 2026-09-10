#!/usr/bin/env python3
"""Privileged, one-time migration from shared PM2 to isolated systemd services."""
import os
from pathlib import Path
import pwd
import secrets
import shutil
import subprocess
import sys

SOURCE = Path(__file__).resolve().parents[1]
DEST = Path('/srv/monereen/current')
CONFIG = Path('/etc/monereen')


def run(args, **kwargs):
    return subprocess.run(args, check=True, **kwargs)


def read_env(path):
    return dict(line.split('=', 1) for line in path.read_text().splitlines()
                if '=' in line and not line.startswith('#'))


def write_env(path, values):
    path.write_text(''.join(f'{key}={value}\n' for key, value in values.items()))
    path.chmod(0o600)


def main():
    if os.geteuid() != 0:
        sys.exit('Run: sudo python3 infrastructure/isolate-app.py')
    if DEST.exists():
        sys.exit('Existing isolated deployment found; refusing to overwrite it.')
    for path in ['apps/storefront/.next-hardened/BUILD_ID', 'packages/medusa/.medusa/server/public/admin/index.html']:
        if not (SOURCE / path).exists():
            sys.exit('Production builds must pass before isolation: ' + path)
    node = SOURCE / '.runtime/node/bin/node'
    pm2 = Path('/home/shawon/.nvm/versions/node/v22.11.0/lib/node_modules/pm2/bin/pm2')
    run(['nginx', '-t'])
    try:
        pwd.getpwnam('monereen')
    except KeyError:
        run(['useradd', '--system', '--user-group', '--home-dir', '/srv/monereen', '--shell', '/usr/sbin/nologin', 'monereen'])
    CONFIG.mkdir(mode=0o700, exist_ok=True)
    DEST.mkdir(parents=True, mode=0o750)
    run(['rsync', '-a', '--exclude=.git', '--exclude=.backups', '--exclude=.env*', '--exclude=.next', '--exclude=.turbo', '--exclude=*.log', str(SOURCE) + '/', str(DEST) + '/'])
    runtime = Path('/srv/monereen/runtime/node')
    runtime.parent.mkdir(exist_ok=True)
    shutil.copy2(node, runtime)
    runtime.chmod(0o755)
    run(['chown', '-R', 'root:monereen', str(DEST)])
    run(['chmod', '-R', 'o-rwx', str(DEST)])
    cache = DEST / 'apps/storefront/.next-hardened/cache'
    cache.mkdir(exist_ok=True)
    run(['chown', '-R', 'monereen:monereen', str(cache)])

    old = read_env(SOURCE / '.env')
    backend = read_env(SOURCE / 'packages/medusa/.env')
    app_password = secrets.token_hex(32)
    root_password = secrets.token_hex(32)
    media_password = secrets.token_hex(32)
    backend.update(DATABASE_URL=f'postgres://monereen_app:{app_password}@127.0.0.1:5432/monereen',
                   JWT_SECRET=secrets.token_hex(32), COOKIE_SECRET=secrets.token_hex(32),
                   MINIO_SECRET_KEY=media_password)
    supporting = dict(old)
    supporting.update(POSTGRES_PASSWORD=root_password, MINIO_ROOT_PASSWORD=media_password,
                      MINIO_SECRET_KEY=media_password, DATABASE_URL=backend['DATABASE_URL'],
                      DOCKER_DATABASE_URL=backend['DATABASE_URL'].replace('@127.0.0.1:', '@postgres:'))
    write_env(CONFIG / 'backend.env', backend)
    write_env(CONFIG / 'services.env', supporting)
    write_env(CONFIG / 'storefront.env', read_env(SOURCE / 'apps/storefront/.env.local'))
    write_env(CONFIG / 'previous-services.env', old)

    shared = '''Restart=on-failure
RestartSec=5
User=monereen
Group=monereen
Environment=NODE_ENV=production
UMask=0077
NoNewPrivileges=true
PrivateTmp=true
ProtectHome=true
ProtectSystem=strict
ProtectKernelTunables=true
ProtectKernelModules=true
ProtectControlGroups=true
RestrictSUIDSGID=true
CapabilityBoundingSet=
RestrictAddressFamilies=AF_UNIX AF_INET AF_INET6
'''
    for name, directory, entry, args, env in [
        ('medusa', 'packages/medusa/.medusa/server', 'packages/medusa/node_modules/@medusajs/cli/cli.js', 'start --host 127.0.0.1 --port 9000', 'backend'),
        ('storefront', 'apps/storefront', 'apps/storefront/node_modules/next/dist/bin/next', 'start -H 127.0.0.1 -p 3000', 'storefront'),
    ]:
        unit = f'[Unit]\nDescription=Monereen {name}\nAfter=network-online.target docker.service\nWants=network-online.target\n\n[Service]\n{shared}WorkingDirectory={DEST / directory}\nEnvironmentFile={CONFIG / (env + ".env")}\nExecStart={runtime} {DEST / entry} {args}\n'
        if name == 'storefront':
            unit += f'Environment=NEXT_DIST_DIR=.next-hardened\nReadWritePaths={cache}\n'
        unit += '\n[Install]\nWantedBy=multi-user.target\n'
        Path(f'/etc/systemd/system/monereen-{name}.service').write_text(unit)
    run(['systemd-analyze', 'verify', '/etc/systemd/system/monereen-medusa.service', '/etc/systemd/system/monereen-storefront.service'])
    # Stop only this app before replacing its credentials; other PM2 apps stay running.
    run(['runuser', '-u', 'shawon', '--', str(node), str(pm2), 'stop', 'monereen-medusa', 'monereen-storefront'])
    sql = f"BEGIN; ALTER ROLE monereen PASSWORD '{root_password}'; ALTER ROLE monereen_app PASSWORD '{app_password}'; COMMIT;"
    run(['docker', 'exec', '-i', 'monereen-postgres', 'psql', '-U', 'monereen', '-d', 'monereen', '-v', 'ON_ERROR_STOP=1'], input=sql, text=True, stdout=subprocess.DEVNULL)
    run(['docker', 'compose', '-p', 'monereen', '--env-file', str(CONFIG / 'services.env'), '-f', str(SOURCE / 'docker-compose.yml'), '-f', str(SOURCE / 'docker-compose.override.yml'), 'up', '-d', '--no-deps', 'minio'])
    # Systemd reads the secrets as root; application processes receive only their own environment.
    admin = SOURCE / '.env.admin.local'
    if admin.exists():
        shutil.copy2(admin, CONFIG / 'admin-login.env')
        os.chown(admin, 0, 0)
        admin.chmod(0o600)
    run(['systemctl', 'daemon-reload'])
    run(['systemctl', 'enable', '--now', 'monereen-medusa', 'monereen-storefront'])
    run(['curl', '--fail', '--retry', '15', '--retry-connrefused', '--retry-delay', '2', '--max-time', '10', 'http://127.0.0.1:9000/health'])
    run(['curl', '--fail', '--retry', '5', '--retry-connrefused', '--max-time', '15', '-o', '/dev/null', 'http://127.0.0.1:3000'])
    run(['runuser', '-u', 'shawon', '--', str(node), str(pm2), 'delete', 'monereen-medusa', 'monereen-storefront'])
    run(['runuser', '-u', 'shawon', '--', str(node), str(pm2), 'save'])
    print('Isolated services active. Runtime secrets: /etc/monereen (root-only).')
    print('Use systemctl/journalctl for Monereen from now on, not PM2.')


if __name__ == '__main__':
    main()
