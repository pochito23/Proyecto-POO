"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuario_controller_js_1 = require("../controllers/usuario.controller.js");
const router = (0, express_1.Router)();
router.get('/:id', usuario_controller_js_1.obtenerusuarioId);
exports.default = router;
