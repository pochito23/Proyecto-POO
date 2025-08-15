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
exports.obtenerArchivosPorId = void 0;
const archivos_model_1 = __importDefault(require("../models/archivos.model"));
//endpoint para conseguir los archivos de un usuario
const obtenerArchivosPorId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const archivos = yield archivos_model_1.default.findOne({ propietario: id });
    if (archivos) {
        res.json({
            html: archivos.codigoHTML,
            css: archivos.codigoCSS,
            JS: archivos.codigoJS
        });
    }
    else {
        res.json({ mensaje: 'crea un archivo' });
    }
});
exports.obtenerArchivosPorId = obtenerArchivosPorId;
