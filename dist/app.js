"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const error_middleware_1 = require("./middleware/error.middleware");
const api_router_1 = __importDefault(require("./routers/api.router"));
const users_router_1 = __importDefault(require("./routers/users.router"));
const categories_router_1 = __importDefault(require("./routers/categories.router"));
const items_router_1 = __importDefault(require("./routers/items.router"));
const PORT = 5000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.json());
app.use("/api", api_router_1.default);
app.use("/api/users", users_router_1.default);
app.use("/api/items", items_router_1.default);
app.use("/api/categories", categories_router_1.default);
app.use("/*", (req, res) => {
    res.status(404).send({ message: "invalid endpoint" });
});
app.use(error_middleware_1.handlePSQLError);
app.use(error_middleware_1.handleCustomError);
app.use(error_middleware_1.handleServerError);
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}...`);
});
exports.default = app;
