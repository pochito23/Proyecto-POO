import { Router } from "express";

import { obtenerusuarioId,
    registrarUsuario,
    loginUsuario,
    recuperarContraseña
 } from "../controllers/usuario.controller.js";

const router = Router();

router.get('/:id',obtenerusuarioId);
router.post('/',registrarUsuario);
router.post('/login',loginUsuario);
router.post('/recuperar-contrasena',recuperarContraseña);

export default router;