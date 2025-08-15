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
exports.recuperarContraseña = exports.loginUsuario = exports.registrarUsuario = exports.obtenerusuarioId = void 0;
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
//endpoint para registrar un nuevo usuario
const registrarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo, usuario, contraseña, plan, preguntaSeguridad, respuestaSeguridad } = req.body;
    const usuarioExistente = yield usuario_model_1.default.findOne({ correo });
    if (usuarioExistente) {
        res.json("ya existe un usuario con ese correo");
    }
    else {
        const numeroUsuario = (yield usuario_model_1.default.countDocuments()) + 1;
        const nuevoUsuario = new usuario_model_1.default({
            correo,
            usuario,
            contraseña,
            plan: 'gratis',
            preguntaSeguridad,
            respuestaSeguridad,
            numeroUsuario,
        });
        yield nuevoUsuario.save();
        const _a = nuevoUsuario.toObject(), { contraseña: _ } = _a, usuarioSinClave = __rest(_a, ["contrase\u00F1a"]);
        res.json({ usuario: usuarioSinClave,
            mensaje: "Usuario registrado exitosamente", });
    }
});
exports.registrarUsuario = registrarUsuario;
//endpoint para login de usuario
const loginUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo, contraseña } = req.body;
    const usuarioEncontrado = yield usuario_model_1.default.findOne({ correo, contraseña });
    if (!correo || !contraseña) {
        return res.status(400).json({ mensaje: "Correo y contraseña son requeridos" });
    }
    if (usuarioEncontrado) {
        const _a = usuarioEncontrado.toObject(), { contraseña: _ } = _a, usuarioSinClave = __rest(_a, ["contrase\u00F1a"]);
        res.json({ usuario: usuarioSinClave, mensaje: "Inicio de sesión exitoso" });
    }
    else {
        res.status(401).json({ mensaje: "Credenciales inválidas" });
    }
});
exports.loginUsuario = loginUsuario;
//Recuperar contraseña
const recuperarContraseña = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo, respuestaSeguridad } = req.body;
    // Validar que el correo esté presente
    if (!correo) {
        return res.status(400).json({ mensaje: "Correo es requerido" });
    }
    // Buscar usuario
    const usuario = yield usuario_model_1.default.findOne({ correo });
    if (!usuario) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    // Si no mandó la respuesta, devolver la pregunta
    if (!respuestaSeguridad) {
        return res.status(400).json({ mensaje: usuario.preguntaSeguridad });
    }
    // Comparar respuestas
    if (usuario.respuestaSeguridad.trim().toLowerCase() === respuestaSeguridad.trim().toLowerCase()) {
        return res.json({ mensaje: "Respuesta correcta", contraseña: usuario.contraseña });
    }
    else {
        return res.status(400).json({ mensaje: "Respuesta de seguridad incorrecta" });
    }
});
exports.recuperarContraseña = recuperarContraseña;
