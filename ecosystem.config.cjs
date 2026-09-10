const path = require("node:path");
const fs = require("node:fs");
const root = __dirname;
const medusa = path.join(root, "packages/medusa");
const dotenv = require(path.join(medusa, "node_modules/dotenv"));
const backendEnv = dotenv.parse(fs.readFileSync(path.join(medusa, ".env")));

module.exports = {
  apps: [
    {
      name: "monereen-medusa",
      cwd: path.join(medusa, ".medusa/server"),
      script: path.join(medusa, "node_modules/@medusajs/cli/cli.js"),
      args: "start --host 127.0.0.1 --port 9000",
      env: { ...backendEnv, NODE_ENV: "production" },
      interpreter: path.join(root, ".runtime/node/bin/node"),
      restart_delay: 5000,
      kill_timeout: 15000,
    },
    {
      name: "monereen-storefront",
      cwd: path.join(root, "apps/storefront"),
      script: path.join(root, "apps/storefront/node_modules/next/dist/bin/next"),
      args: "start -H 127.0.0.1 -p 3000",
      env: { NODE_ENV: "production", NEXT_DIST_DIR: ".next-hardened" },
      interpreter: path.join(root, ".runtime/node/bin/node"),
      restart_delay: 5000,
      kill_timeout: 10000,
    },
  ],
};
