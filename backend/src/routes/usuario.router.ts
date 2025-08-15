import { Router } from "express";

import { obtenerId } from "../controllers/usuario.controller.js";

const router = Router();

router.get('/:id',obtenerId);