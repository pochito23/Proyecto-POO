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
exports.cambiarPlan = exports.actualizarUsuario = exports.recuperarContraseña = exports.loginUsuario = exports.registrarUsuario = exports.obtenerusuarioId = void 0;
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
        res.status(404).json({ mensaje: "usuario no encontrado" });
    }
});
exports.obtenerusuarioId = obtenerusuarioId;
//endpoint para registrar un nuevo usuario
const registrarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo, usuario, contraseña, plan, preguntaSeguridad, respuestaSeguridad, } = req.body;
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
            plan: "gratis",
            preguntaSeguridad,
            respuestaSeguridad,
            numeroUsuario,
        });
        yield nuevoUsuario.save();
        const _a = nuevoUsuario.toObject(), { contraseña: _ } = _a, usuarioSinClave = __rest(_a, ["contrase\u00F1a"]);
        res.json({
            usuario: usuarioSinClave,
            mensaje: "Usuario registrado exitosamente",
        });
    }
});
exports.registrarUsuario = registrarUsuario;
//endpoint para login de usuario
const loginUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo, contraseña } = req.body;
    const usuarioEncontrado = yield usuario_model_1.default.findOne({ correo, contraseña });
    if (!correo || !contraseña) {
        return res
            .status(400)
            .json({ mensaje: "Correo y contraseña son requeridos" });
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
    if (usuario.respuestaSeguridad.trim().toLowerCase() ===
        respuestaSeguridad.trim().toLowerCase()) {
        return res.json({
            mensaje: "Respuesta correcta",
            contraseña: usuario.contraseña,
        });
    }
    else {
        return res
            .status(400)
            .json({ mensaje: "Respuesta de seguridad incorrecta" });
    }
});
exports.recuperarContraseña = recuperarContraseña;
//actulizar usuario
const actualizarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const { correo, usuario, contraseña, img } = req.body;
        const usuarioExistente = yield usuario_model_1.default.findOne({ numeroUsuario: id });
        if (!usuarioExistente) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        // Verificar correo único
        if (correo && correo !== usuarioExistente.correo) {
            const correoEnUso = yield usuario_model_1.default.findOne({
                correo,
                numeroUsuario: { $ne: id },
            });
            if (correoEnUso) {
                return res.status(400).json({ mensaje: "El correo ya está en uso por otro usuario" });
            }
        }
        // Verificar usuario único
        if (usuario && usuario !== usuarioExistente.usuario) {
            const usuarioEnUso = yield usuario_model_1.default.findOne({
                usuario,
                numeroUsuario: { $ne: id },
            });
            if (usuarioEnUso) {
                return res.status(400).json({ mensaje: "El nombre de usuario ya está en uso" });
            }
        }
        const datosActualizar = {};
        if (correo)
            datosActualizar.correo = correo;
        if (usuario)
            datosActualizar.usuario = usuario;
        if (contraseña)
            datosActualizar.contraseña = contraseña;
        if (img)
            datosActualizar.img = img;
        const usuarioActualizado = yield usuario_model_1.default.findOneAndUpdate({ numeroUsuario: id }, datosActualizar, { new: true });
        if (!usuarioActualizado) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        const _a = usuarioActualizado.toObject(), { contraseña: _ } = _a, usuarioSinClave = __rest(_a, ["contrase\u00F1a"]);
        res.json({
            success: true, // ✅ Agregado para consistencia
            usuario: usuarioSinClave,
            mensaje: "Perfil actualizado correctamente",
        });
    }
    catch (error) {
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
});
exports.actualizarUsuario = actualizarUsuario;
//endpoint para cambiar el plan del usuario
const cambiarPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const plan = req.body.plan;
    if (!req.body.plan) {
        return res.status(400).json({ mensaje: "Plan es requerido" });
    }
    const planesValidos = ['gratis', 'estudiante', 'pro', 'empresarial'];
    if (!planesValidos.includes(plan)) {
        return res.status(400).json({ mensaje: "Plan no válido" });
    }
    const usuarioActualizado = yield usuario_model_1.default.findOneAndUpdate({ numeroUsuario: id }, { plan: plan }, { new: true });
    if (!usuarioActualizado) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    const _a = usuarioActualizado.toObject(), { contraseña: _ } = _a, usuarioSinClave = __rest(_a, ["contrase\u00F1a"]);
    res.json({
        usuario: usuarioSinClave,
        mensaje: `Plan cambiado a ${plan} exitosamente`
    });
});
exports.cambiarPlan = cambiarPlan;
