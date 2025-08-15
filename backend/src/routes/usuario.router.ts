import { Router } from "express";

import { obtenerusuarioId } from "../controllers/usuario.controller.js";

const router = Router();

router.get('/:id',obtenerusuarioId);

export default router;