"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const ENV = process.env.NODE_ENV || "development";
const dotenv_1 = __importDefault(require("dotenv"));
console.log(ENV);
dotenv_1.default.config({
    path: `${__dirname}/../../.env.${ENV}`,
});
console.log(`${__dirname}/../../.env.${ENV}`);
if (!process.env.PGDATABASE) {
    throw new Error("PGDATABASE not set");
}
exports.default = new pg_1.Pool();
