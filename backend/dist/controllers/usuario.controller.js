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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerusuarioId = void 0;
const usuario_model_1 = __importDefault(require("../models/usuario.model"));
//endpoint para conseguir usuario por id
const obtenerusuarioId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const usuario = yield usuario_model_1.default.findOne({ numeroUsuario: id });
    if (usuario) {
        //conseguir el usuario sin su campo clave
        const _a = usuario.toObject(), { contraseña } = _a, usuarioSinClave = __rest(_a, ["contrase\u00F1a"]);
        res.json(usuarioSinClave);
    }
    else {
        res.status(404).json({ mensaje: 'usuario no encontrado' });
    }
});
exports.obtenerusuarioId = obtenerusuarioId;
//endpoint para obtener las carpetas, archivos de un usuario
