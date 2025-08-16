import { Router } from "express";

import { obtenerusuarioId,
    registrarUsuario,
    loginUsuario,
    recuperarContraseña,
    actualizarUsuario,
    cambiarPlan
 } from "../controllers/usuario.controller";

const router = Router();

router.get('/:id',obtenerusuarioId);
router.post('/',registrarUsuario);
router.post('/login',loginUsuario);
router.post('/recuperar-contrasena',recuperarContraseña);
router.put('/:id',actualizarUsuario);
router.put('/:id/plan',cambiarPlan);

export default router;