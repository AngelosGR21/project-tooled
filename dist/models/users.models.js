"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertUser = exports.verifyUser = void 0;
const JWT_1 = require("../utils/JWT");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const postcodeAPI_1 = require("../utils/postcodeAPI");
const connection_1 = __importDefault(require("../db/connection"));
const verifyUser = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    const incorrectCredentials = { status: 400, message: "Username or password is incorrect" };
    const { username, password } = credentials;
    const queryString = `SELECT * FROM users WHERE username = $1`;
    const queryValue = [username];
    const user = yield connection_1.default.query(queryString, queryValue);
    if (user.rowCount) {
        const hash = user.rows[0].password;
        let isPasswordCorrect = yield bcryptjs_1.default.compare(password, hash);
        if (isPasswordCorrect) {
            return (0, JWT_1.generateToken)(user.rows[0]);
        }
        else {
            return Promise.reject(incorrectCredentials);
        }
    }
    else {
        return Promise.reject(incorrectCredentials);
    }
});
exports.verifyUser = verifyUser;
const insertUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, postcode, name, avatar, password } = user;
    const createUserQuery = `INSERT INTO users(username, name, lat, long, avatar, password)
    VALUES($1, $2, $3, $4, $5, $6) RETURNING *`;
    const createUserValues = [username, name];
    const coordinates = yield (0, postcodeAPI_1.translatePostcodeToCoordinates)(postcode);
    const { lat, long } = coordinates;
    createUserValues.push(lat, long);
    // AVATAR functionality here....
    createUserValues.push("");
    const hashPassword = yield bcryptjs_1.default.hash(password, 10);
    createUserValues.push(hashPassword);
    let response = yield connection_1.default.query(createUserQuery, createUserValues);
    const userDetails = Object.assign({}, response.rows[0]);
    delete userDetails.password;
    return (0, JWT_1.generateToken)(userDetails);
});
exports.insertUser = insertUser;
