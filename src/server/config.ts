export const config = {
  server: {
    host: process.env.SERVER_HOST || "0.0.0.0",
    port: parseInt(process.env.SERVER_PORT || "8080", 10),
    env: process.env.NODE_ENV || "development",
  },
  database: {
    host: process.env.DATABASE_HOST || "localhost",
    port: parseInt(process.env.DATABASE_PORT || "5432", 10),
    name: process.env.DATABASE_NAME || "nexus3_cbc",
    user: process.env.DATABASE_USERNAME || "dev",
    password: process.env.DATABASE_PASSWORD || "dev",
  },
} as const;
