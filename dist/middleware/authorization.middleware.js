"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postAuth = exports.locationAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    path: `${__dirname}/../../.env.keys`
});
const locationAuth = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (token) {
        jsonwebtoken_1.default.verify(token, String(process.env.TEST_KEY), (err, decoded) => {
            if (err) {
                res.locals.tokenError = { status: 410, message: "Token expired or is invalid, login again" };
                next();
            }
            else {
                res.locals.user = decoded;
                res.locals.updatedSortBy = ["price", "rating", "location"];
                next();
            }
        });
    }
    else {
        next();
    }
};
exports.locationAuth = locationAuth;
const postAuth = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (token) {
        jsonwebtoken_1.default.verify(token, String(process.env.TEST_KEY), (err, decoded) => {
            if (err) {
                next({ status: 410, message: "Token expired or is invalid, login again" });
            }
            res.locals.user = decoded;
            next();
        });
    }
    else {
        next({ status: 401, message: "you are not logged in" });
    }
};
exports.postAuth = postAuth;
