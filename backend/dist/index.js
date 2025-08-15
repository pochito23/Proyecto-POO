"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const usuario_router_1 = __importDefault(require("./routes/usuario.router"));
const archivos_router_1 = __importDefault(require("./routes/archivos.router"));
const baseDatos_1 = require("./moduls/baseDatos");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
(0, baseDatos_1.conectarDb)().then(() => {
    app.listen(PORT, () => {
        console.log(`El servidor esta corriendo en el puerto ${PORT}`);
    });
});
app.use('/usuarios', usuario_router_1.default);
app.use('/archivos', archivos_router_1.default);
