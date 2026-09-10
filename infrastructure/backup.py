#!/usr/bin/env python3
"""Encrypt a PostgreSQL dump and MinIO snapshot locally."""
import datetime
import fcntl
import os
from pathlib import Path
import secrets
import subprocess
import tarfile
import tempfile

ROOT = Path(__file__).resolve().parents[1]
BACKUPS = ROOT / '.backups'


def main():
    os.umask(0o077)
    BACKUPS.mkdir(mode=0o700, exist_ok=True)
    lock = (BACKUPS / '.lock').open('w')
    fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
    key = ROOT / '.env.backup.local'
    if not key.exists():
        key.write_text(secrets.token_urlsafe(48) + '\n')
        key.chmod(0o600)
    stamp = datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ')
    destination = BACKUPS / f'monereen-{stamp}.tar.gz.gpg'
    with tempfile.TemporaryDirectory(prefix='.snapshot-', dir=BACKUPS) as temp:
        stage = Path(temp)
        with (stage / 'database.dump').open('wb') as dump:
            subprocess.run(['docker', 'exec', 'monereen-postgres', 'pg_dump', '-U', 'monereen', '-d', 'monereen', '-Fc'], stdout=dump, check=True)
        subprocess.run(['docker', 'cp', 'monereen-minio:/data', str(stage / 'media')], check=True)
        with tarfile.open(stage / 'snapshot.tar.gz', 'w:gz') as archive:
            archive.add(stage / 'database.dump', arcname='database.dump')
            archive.add(stage / 'media', arcname='media')
        subprocess.run(['gpg', '--batch', '--yes', '--pinentry-mode', 'loopback', '--passphrase-file', str(key), '--symmetric', '--cipher-algo', 'AES256', '--output', str(destination), str(stage / 'snapshot.tar.gz')], check=True)
        # Decrypt and list the archive to catch corrupt/unreadable snapshots now.
        subprocess.run(['gpg', '--batch', '--yes', '--pinentry-mode', 'loopback', '--passphrase-file', str(key), '--output', str(stage / 'verified.tar.gz'), '--decrypt', str(destination)], check=True)
        with tarfile.open(stage / 'verified.tar.gz', 'r:gz') as archive:
            assert 'database.dump' in archive.getnames()
        subprocess.run(['docker', 'exec', '-i', 'monereen-postgres', 'pg_restore', '--list'], stdin=(stage / 'database.dump').open('rb'), stdout=subprocess.DEVNULL, check=True)
    print(f'Encrypted, verified backup: {destination}')
    print('Store .env.backup.local in a separate password manager; it is required to restore.')


if __name__ == '__main__':
    main()
