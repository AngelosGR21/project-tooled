"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const webSockets = (server) => {
    const wss = new ws_1.Server({ server });
    wss.on("connection", (ws, req) => {
        ws.on("message", message => {
            const msg = JSON.parse(message.toString());
            console.log(msg);
            ws.send("Hey from the backend");
        });
    });
};
exports.default = webSockets;
