"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
// process.env.PGDATABASE = "tooled"
// process.env.PGPASSWORD = "thisismyfinalpassword"
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    path: `${process.env}`,
});
console.log(process.env.PGDATABASE);
if (!process.env.PGDATABASE) {
    throw new Error("PGDATABASE not set");
}
exports.default = new pg_1.Pool();
