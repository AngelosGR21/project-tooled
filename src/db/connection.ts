import { Pool } from "pg";
const ENV = process.env.NODE_ENV || "development";

import dotenv from "dotenv";

dotenv.config({
  path: `${__dirname}/../../.env.${ENV}`,
});

if (ENV === "production") {
  if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
    throw new Error("PGDATABASE or DATABASE_URL not set");
  }
}

const config =
  ENV === "production"
    ? {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    }
    : {};

export default new Pool(config);
