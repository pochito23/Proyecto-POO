"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const archivos_controller_1 = require("../controllers/archivos.controller");
const router = (0, express_1.Router)();
router.get('/:id', archivos_controller_1.obtenerArchivosPorId);
exports.default = router;
