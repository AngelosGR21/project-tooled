import { Pool } from "pg"
const ENV = process.env.NODE_ENV || "development"

import dotenv from "dotenv"

dotenv.config({
	path: `${__dirname}/../../.env.${ENV}`,
})

if (!process.env.PGDATABASE) {
	throw new Error("PGDATABASE not set")
}

export default new Pool()
