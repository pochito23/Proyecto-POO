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
exports.compartirArchivo = exports.obtenerArchivosPorID = exports.buscarArchivos = exports.obtenerArchivosPorTipo = exports.eliminarArchivo = exports.actualizarArchivo = exports.crearArchivo = exports.obtenerContenidoCarpeta = exports.obtenerCarpetasRaiz = void 0;
const mongoose_1 = require("mongoose");
const archivos_model_1 = __importDefault(require("../models/archivos.model"));
// Obtener carpetas/proyectos/snippets raíz del usuario
const obtenerCarpetasRaiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const propietario = parseInt(req.params.numeroUsuario);
    const elementosRaiz = yield archivos_model_1.default.find({ propietario, carpetaPadre: null });
    res.json(elementosRaiz);
});
exports.obtenerCarpetasRaiz = obtenerCarpetasRaiz;
// Obtener contenido de una carpeta específica
const obtenerContenidoCarpeta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const propietario = parseInt(req.params.numeroUsuario);
    let carpetaPadreId = null;
    if (req.params.id && req.params.id !== 'null') {
        if (!mongoose_1.Types.ObjectId.isValid(req.params.id))
            return res.status(400).json({ mensaje: "Id de carpeta inválido" });
        carpetaPadreId = new mongoose_1.Types.ObjectId(req.params.id);
    }
    const contenido = yield archivos_model_1.default.find({ propietario, carpetaPadre: carpetaPadreId });
    res.json(contenido);
});
exports.obtenerContenidoCarpeta = obtenerContenidoCarpeta;
// Crear carpeta/proyecto/snippet
const crearArchivo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const nuevoArchivo = new archivos_model_1.default(req.body);
    yield nuevoArchivo.save();
    res.status(201).json(nuevoArchivo);
});
exports.crearArchivo = crearArchivo;
// Actualizar archivo
const actualizarArchivo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const archivoActualizado = yield archivos_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!archivoActualizado) {
        return res.status(404).json({ mensaje: "Archivo no encontrado" });
    }
    res.json(archivoActualizado);
});
exports.actualizarArchivo = actualizarArchivo;
// Eliminar archivo
const eliminarArchivo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const archivoEliminado = yield archivos_model_1.default.findByIdAndDelete(req.params.id);
    if (!archivoEliminado)
        return res.status(404).json({ mensaje: "Archivo no encontrado" });
    res.json({ mensaje: "Archivo eliminado" });
});
exports.eliminarArchivo = eliminarArchivo;
// Obtener archivos por tipo
const obtenerArchivosPorTipo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { numeroUsuario, tipo } = req.params;
        const archivos = yield archivos_model_1.default.find({ propietario: parseInt(numeroUsuario), tipo });
        res.json(archivos);
    }
    catch (error) {
        res.status(500).json({ mensaje: "Error al obtener archivos" });
    }
});
exports.obtenerArchivosPorTipo = obtenerArchivosPorTipo;
//buscar archivos por nombre
const buscarArchivos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const propietario = parseInt(req.params.numeroUsuario);
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
        return res.status(400).json({ mensaje: "Término de búsqueda requerido" });
    }
    const archivos = yield archivos_model_1.default.find({
        propietario,
        nombre: { $regex: q, $options: 'i' }
    }).sort({ fechaModificacion: -1 });
    res.json(archivos);
});
exports.buscarArchivos = buscarArchivos;
// Obtener archivos por oID
const obtenerArchivosPorID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const archivo = yield archivos_model_1.default.findById(req.params.id);
        if (!archivo) {
            return res.status(404).json({ mensaje: "Archivo no encontrado" });
        }
        res.json(archivo);
    }
    catch (error) {
        res.status(400).json({ mensaje: "ID inválido" });
    }
});
exports.obtenerArchivosPorID = obtenerArchivosPorID;
const compartirArchivo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const archivo = yield archivos_model_1.default.findById(req.params.id);
    if (!archivo)
        return res.status(404).json({ mensaje: 'Archivo no encontrado' });
    const { usuarios } = req.body; // array de {usuario, permisos}
    usuarios.forEach((u) => {
        const existe = archivo.compartido.some(c => c.usuario === u.usuario);
        if (!existe) {
            archivo.compartido.push({ usuario: u.usuario, permisos: u.permisos });
        }
    });
    yield archivo.save();
    res.json({ mensaje: 'Archivo compartido correctamente' });
});
exports.compartirArchivo = compartirArchivo;
