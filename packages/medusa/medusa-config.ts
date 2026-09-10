import { loadEnv, defineConfig, Modules } from "@medusajs/framework/utils"
import type { InputConfigWithObjectModules } from "@medusajs/framework/types"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

if (process.env.NODE_ENV === "production") {
  for (const key of ["JWT_SECRET", "COOKIE_SECRET"]) {
    const value = process.env[key]
    if (!value || value.length < 32 || /supersecret|change.this/i.test(value)) {
      throw new Error(`${key} must be a strong secret in production`)
    }
  }
}

const minioEndpoint = process.env.MINIO_ENDPOINT
const minioPort = process.env.MINIO_PORT
const minioBucket = process.env.MINIO_BUCKET
const minioFileUrl = process.env.MINIO_FILE_URL
const hasMinio = Boolean(
  minioEndpoint &&
  minioPort &&
  minioBucket &&
  minioFileUrl &&
  process.env.MINIO_ACCESS_KEY &&
  process.env.MINIO_SECRET_KEY,
)

const modules: NonNullable<InputConfigWithObjectModules["modules"]> = {
  drop: { resolve: "./src/modules/drop" },
  story: { resolve: "./src/modules/story" },
  maker: { resolve: "./src/modules/maker" },
  craft: { resolve: "./src/modules/craft" },
  material: { resolve: "./src/modules/material" },
  place: { resolve: "./src/modules/place" },
  page: { resolve: "./src/modules/page" },
  homepageExperience: { resolve: "./src/modules/homepage-experience" },
  campaignTheme: { resolve: "./src/modules/campaign-theme" },
  navigationConfig: { resolve: "./src/modules/navigation-config" },
}

if (hasMinio) {
  const endpoint = /^https?:\/\//.test(minioEndpoint!)
    ? minioEndpoint!
    : `http://${minioEndpoint}:${minioPort}`

  modules[Modules.FILE] = {
    resolve: "@medusajs/medusa/file",
    options: {
      providers: [
        {
          resolve: "@medusajs/medusa/file-s3",
          id: "minio",
          options: {
            file_url: minioFileUrl,
            access_key_id: process.env.MINIO_ACCESS_KEY,
            secret_access_key: process.env.MINIO_SECRET_KEY,
            region: process.env.MINIO_REGION || "us-east-1",
            bucket: minioBucket,
            endpoint,
            acl: false,
            additional_client_config: { forcePathStyle: true },
          },
        },
      ],
    },
  }
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    workerMode: (process.env.MEDUSA_WORKER_MODE || "shared") as "shared" | "worker" | "server",
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  admin: {
    backendUrl: process.env.MEDUSA_BACKEND_URL,
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
  },
  modules,
})
