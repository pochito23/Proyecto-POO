import {Router} from 'express'
import { obtenerArchivosPorId } from '../controllers/archivos.controller'

const router = Router()

router.get('/:id', obtenerArchivosPorId);

export default router