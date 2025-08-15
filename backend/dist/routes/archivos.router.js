"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const archivos_controller_1 = require("../controllers/archivos.controller");
const router = (0, express_1.Router)();
// Obtener carpetas raíz del usuario
router.get('/usuario/:numeroUsuario/raiz', archivos_controller_1.obtenerCarpetasRaiz);
// Obtener contenido de una carpeta específica
router.get('/usuario/:numeroUsuario/carpeta/:id', archivos_controller_1.obtenerContenidoCarpeta);
// Crear nueva carpeta/proyecto/snippet
router.post('/crear', archivos_controller_1.crearArchivo);
// Actualizar carpeta/código
router.put('/actualizar/:id', archivos_controller_1.actualizarArchivo);
// Eliminar carpeta/archivo
router.delete('/eliminar/:id', archivos_controller_1.eliminarArchivo);
// Compartir con otro usuario
router.post('/compartir/:id', archivos_controller_1.compartirArchivo);
// Obtener elementos compartidos conmigo
router.get('/usuario/:numeroUsuario/compartidos', archivos_controller_1.obtenerCompartidosConmigo);
exports.default = router;
