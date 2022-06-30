"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const api_router_1 = __importDefault(require("./routers/api.router"));
const users_router_1 = __importDefault(require("./routers/users.router"));
const error_middleware_1 = require("./middleware/error.middleware");
const PORT = 5000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api", api_router_1.default);
app.use("/users", users_router_1.default);
app.use(error_middleware_1.handleCustomError);
app.use(error_middleware_1.handleServerError);
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}...`);
});
exports.default = app;
