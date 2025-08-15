import { Request, Response } from "express";
import { Types } from "mongoose";
import Archivo from "../models/archivos.model";

// Obtener carpetas/proyectos/snippets raíz del usuario
export const obtenerCarpetasRaiz = async (req: Request, res: Response) => {
  const propietario = parseInt(req.params.numeroUsuario);
  const elementosRaiz = await Archivo.find({ propietario, carpetaPadre: null });
  res.json(elementosRaiz);
};

// Obtener contenido de una carpeta específica
export const obtenerContenidoCarpeta = async (req: Request, res: Response) => {
  const propietario = parseInt(req.params.numeroUsuario);
  let carpetaPadreId: Types.ObjectId | null = null;

  if (req.params.id && req.params.id !== 'null') {
    if (!Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ mensaje: "Id de carpeta inválido" });
    carpetaPadreId = new Types.ObjectId(req.params.id);
  }

  const contenido = await Archivo.find({ propietario, carpetaPadre: carpetaPadreId });
  res.json(contenido);
};

// Crear carpeta/proyecto/snippet
export const crearArchivo = async (req: Request, res: Response) => {
  const nuevoArchivo = new Archivo(req.body);
  await nuevoArchivo.save();
  res.status(201).json(nuevoArchivo);
};

// Actualizar archivo
export const actualizarArchivo = async (req: Request, res: Response) => {
  const archivoActualizado = await Archivo.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!archivoActualizado) {
    return res.status(404).json({ mensaje: "Archivo no encontrado" });
  }
  res.json(archivoActualizado);
};

// Eliminar archivo
export const eliminarArchivo = async (req: Request, res: Response) => {
  const archivoEliminado = await Archivo.findByIdAndDelete(req.params.id);
  if (!archivoEliminado) return res.status(404).json({ mensaje: "Archivo no encontrado" });
  res.json({ mensaje: "Archivo eliminado" });
};




export const compartirArchivo = async (req: Request, res: Response) => {
  const { usuario, permisos } = req.body;
  const archivo = await Archivo.findById(req.params.id);
  
  if (!archivo) {
    return res.status(404).json({ mensaje: "Archivo no encontrado" });
  }

  if (!usuario || !permisos) {
    return res.status(400).json({ mensaje: "Falta usuario o permisos" });
  }

  // Convertir a número por si viene como string
  archivo.compartido.push({ usuario: Number(usuario), permisos });
  await archivo.save();

  res.json(archivo);
};
// Obtener archivos compartidos conmigo
export const obtenerCompartidosConmigo = async (req: Request, res: Response) => {
  const numeroUsuario = parseInt(req.params.numeroUsuario);
  const compartidos = await Archivo.find({ 'compartido.usuario': numeroUsuario });
  res.json(compartidos);
};
