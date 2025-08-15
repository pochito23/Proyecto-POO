import { Request, Response } from "express";
import  Archivo  from "../models/archivos.model";

//endpoint para conseguir los archivos de un usuario

export const obtenerArchivosPorId = async (req:Request,res:Response ) => {
    const id= parseInt(req.params.id)

    const archivos = await Archivo.findOne({propietario:id})
    if(archivos){
        res.json({
            html: archivos.codigoHTML,
            css: archivos.codigoCSS, 
            JS: archivos.codigoJS
        })
    }else{
        res.json({mensaje : 'crea un archivo'})
    }
}