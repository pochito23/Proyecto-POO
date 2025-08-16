import { Router } from 'express';
import {
  obtenerCarpetasRaiz,
  obtenerContenidoCarpeta,
  crearArchivo,
  actualizarArchivo,
  eliminarArchivo,
  compartirArchivo,
  obtenerCompartidosConmigo,
  obtenerArchivosPorID,
  buscarArchivos,
  obtenerArchivosPorTipo
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

// Compartir con otro usuario
router.put('/compartir/:id', compartirArchivo);

// Obtener elementos compartidos conmigo
router.get('/usuario/:numeroUsuario/compartidos', obtenerCompartidosConmigo);

// Obtener archivos por tipo 
router.get('/usuario/:numeroUsuario/tipo/:tipo', obtenerArchivosPorTipo);

// Buscar archivos 
router.get('/usuario/:numeroUsuario/buscar', buscarArchivos);

// Obtener archivo específico por ID 
router.get('/:id', obtenerArchivosPorID);

export default router;