import { Request,Response } from "express";

//endpoint para conseguir usuario por id

export const  obtenerId = (req:Request,res:Response)=>{
    const id = req.params.id
    res.json({message:`Usuario con id ${id}`});
}

//endpoint para obtener las carpetas, archivos de un usuario

