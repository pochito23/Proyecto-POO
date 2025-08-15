import { Router } from 'express';
import {
  obtenerCarpetasRaiz,
  obtenerContenidoCarpeta,
  crearArchivo,
  actualizarArchivo,
  eliminarArchivo,
  moverArchivo,
  compartirArchivo,
  obtenerCompartidosConmigo
} from '../controllers/archivos.controller';

const router = Router();

// Obtener carpetas raíz del usuario
router.get('/usuario/:numeroUsuario/raiz', obtenerCarpetasRaiz);

// Obtener contenido de una carpeta específica
router.get('/usuario/:numeroUsuario/carpeta/:id', obtenerContenidoCarpeta);

// Crear nueva carpeta/proyecto/snippet
router.post('/crear', crearArchivo);

// Actualizar carpeta/código
router.put('/actualizar/:id', actualizarArchivo);

// Eliminar carpeta/archivo
router.delete('/eliminar/:id', eliminarArchivo);

// Mover a otra carpeta
router.put('/mover/:id', moverArchivo);

// Compartir con otro usuario
router.post('/compartir/:id', compartirArchivo);

// Obtener elementos compartidos conmigo
router.get('/usuario/:numeroUsuario/compartidos', obtenerCompartidosConmigo);

export default router;