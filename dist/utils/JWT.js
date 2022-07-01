"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    path: `${__dirname}/../../.env.keys`
});
function generateToken(userDetails) {
    const payload = userDetails;
    const privateKey = `${process.env.TEST_KEY}`;
    const signInOptions = {
        algorithm: "HS256",
        expiresIn: "24h",
    };
    return (0, jsonwebtoken_1.sign)(payload, privateKey, signInOptions);
}
exports.generateToken = generateToken;
