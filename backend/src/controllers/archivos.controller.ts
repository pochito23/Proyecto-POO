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





// Obtener archivos por tipo
export const obtenerArchivosPorTipo = async (req: Request, res: Response) => {
  try {
    const { numeroUsuario, tipo } = req.params;
    const archivos = await Archivo.find({ propietario: parseInt(numeroUsuario), tipo }); 
    res.json(archivos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener archivos" });
  }
};

//buscar archivos por nombre
export const buscarArchivos = async (req: Request, res: Response) => {
    const propietario = parseInt(req.params.numeroUsuario);
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ mensaje: "Término de búsqueda requerido" });
    }

    const archivos = await Archivo.find({
      propietario,
      nombre: { $regex: q, $options: 'i' }
    }).sort({ fechaModificacion: -1 });
    
    res.json(archivos);
};

// Obtener archivos por oID
  export const obtenerArchivosPorID = async (req: Request, res: Response) => {
 try {
    const archivo = await Archivo.findById(req.params.id); 
    if (!archivo) {
      return res.status(404).json({ mensaje: "Archivo no encontrado" });
    }
    res.json(archivo);
  } catch (error) {
    res.status(400).json({ mensaje: "ID inválido" });
  }
};

export const compartirArchivo = async (req: Request, res: Response) => {
  const archivo = await Archivo.findById(req.params.id);
  if (!archivo) return res.status(404).json({ mensaje: 'Archivo no encontrado' });

  const { usuarios } = req.body; // array de {usuario, permisos}

  usuarios.forEach((u: {usuario: number, permisos: 'lectura'|'escritura'}) => {
    const existe = archivo.compartido.some(c => c.usuario === u.usuario);
    if (!existe) {
      archivo.compartido.push({ usuario: u.usuario, permisos: u.permisos });
    }
  });

  await archivo.save();
  res.json({ mensaje: 'Archivo compartido correctamente' });
};

