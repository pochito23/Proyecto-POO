import { Request, Response } from "express";
import Archivo from "../models/archivos.model";

// Obtener carpetas raíz del usuario
export const obtenerCarpetasRaiz = async (req: Request, res: Response) => {
  const propietario = parseInt(req.params.numeroUsuario);
  const carpetas = await Archivo.find({ propietario, carpetaPadre: null, tipo: 'carpeta' });
  res.json(carpetas);
};

// Obtener contenido de una carpeta específica
export const obtenerContenidoCarpeta = async (req: Request, res: Response) => {
  const propietario = parseInt(req.params.numeroUsuario);
  const carpetaPadre = req.params.id;
  const contenido = await Archivo.find({ propietario, carpetaPadre });
  res.json(contenido);
};

// Crear nueva carpeta/proyecto/snippet
export const crearArchivo = async (req: Request, res: Response) => {
  try {
    const nuevoArchivo = new Archivo(req.body);
    await nuevoArchivo.save();
    res.status(201).json(nuevoArchivo);
  } catch (error) {
    res.status(400).json({ error: 'error' });
  }
};

// Actualizar carpeta/código
export const actualizarArchivo = async (req: Request, res: Response) => {
  try {
    const archivoActualizado = await Archivo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!archivoActualizado) {
      return res.status(404).json({ mensaje: "Archivo no encontrado" });
    }
    res.json(archivoActualizado);
  } catch (error) {
    res.status(400).json({ error: 'error' });
  }
};

// Eliminar carpeta/archivo
export const eliminarArchivo = async (req: Request, res: Response) => {
  try {
    const archivoEliminado = await Archivo.findByIdAndDelete(req.params.id);
    if (!archivoEliminado) {
      return res.status(404).json({ mensaje: "Archivo no encontrado" });
    }
    res.json({ mensaje: "Archivo eliminado" });
  } catch (error) {
    res.status(400).json({ error: 'error' });
  }
};

// Mover a otra carpeta
export const moverArchivo = async (req: Request, res: Response) => {
  try {
    const archivo = await Archivo.findById(req.params.id);
    if (!archivo) return res.status(404).json({ mensaje: "Archivo no encontrado" });
    archivo.carpetaPadre = req.body.nuevaCarpetaPadre;
    await archivo.save();
    res.json(archivo);
  } catch (error) {
    res.status(400).json({ error: 'error' });
  }
};

// Compartir con otro usuario
export const compartirArchivo = async (req: Request, res: Response) => {
  try {
    const archivo = await Archivo.findById(req.params.id);
    if (!archivo) return res.status(404).json({ mensaje: "Archivo no encontrado" });
    archivo.compartido.push(req.body); // { usuario, permisos }
    await archivo.save();
    res.json(archivo);
  } catch (error) {
    res.status(400).json({ error: 'error' });
  }
};

// Obtener elementos compartidos conmigo
export const obtenerCompartidosConmigo = async (req: Request, res: Response) => {
  const numeroUsuario = parseInt(req.params.numeroUsuario);
  const compartidos = await Archivo.find({ 'compartido.usuario': numeroUsuario });
  res.json(compartidos);
};