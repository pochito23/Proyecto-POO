import { Request,Response } from "express";
import  Usuario  from "../models/usuario.model";

//endpoint para conseguir usuario por id

export const  obtenerusuarioId = async (req:Request,res:Response)=>{
    const id = parseInt(req.params.id)
    const usuario = await Usuario.findOne({numeroUsuario : id})

    if(usuario){
    //conseguir el usuario sin su campo clave
    const { contraseña, ...usuarioSinClave } = usuario.toObject()
        res.json(usuarioSinClave)

    }else{
        res.status(404).json({mensaje: 'usuario no encontrado'})
    }
}

//endpoint para obtener las carpetas, archivos de un usuario