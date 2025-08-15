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

//endpoint para registrar un nuevo usuario
export const registrarUsuario = async (req:Request,res:Response)=>{
    const { correo, usuario, contraseña, plan, preguntaSeguridad, respuestaSeguridad } = req.body;
    const usuarioExistente = await Usuario.findOne({ correo });
if(usuarioExistente){
    res.json("ya existe un usuario con ese correo")
}else{
    const numeroUsuario = await Usuario.countDocuments() + 1; 
    const nuevoUsuario = new Usuario({
        correo,
        usuario,
        contraseña,
        plan: 'gratis',
        preguntaSeguridad,
        respuestaSeguridad,
        numeroUsuario,
    });
    await nuevoUsuario.save();
    const { contraseña : _, ...usuarioSinClave } = nuevoUsuario.toObject();
    res.json({usuario: usuarioSinClave,
        mensaje: "Usuario registrado exitosamente",})
}
}

//endpoint para login de usuario
 export const loginUsuario = async (req:Request,res:Response)=>{
    const { correo, contraseña } = req.body;
    const usuarioEncontrado = await Usuario.findOne({ correo, contraseña });

    if(!correo || !contraseña){
        return res.status(400).json({ mensaje: "Correo y contraseña son requeridos" });
    }

    if (usuarioEncontrado) {
        const { contraseña: _, ...usuarioSinClave } = usuarioEncontrado.toObject();
        res.json({ usuario: usuarioSinClave, mensaje: "Inicio de sesión exitoso" });
    } else {
        res.status(401).json({ mensaje: "Credenciales inválidas" });
    }
}

//Recuperar contraseña
export const recuperarContraseña = async (req: Request, res: Response) => {
    const { correo, respuestaSeguridad } = req.body;

    // Validar que el correo esté presente
    if (!correo) {
        return res.status(400).json({ mensaje: "Correo es requerido" });
    }

    // Buscar usuario
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Si no mandó la respuesta, devolver la pregunta
    if (!respuestaSeguridad) {
        return res.status(400).json({ mensaje: usuario.preguntaSeguridad });
    }

    // Comparar respuestas
    if (usuario.respuestaSeguridad.trim().toLowerCase() === respuestaSeguridad.trim().toLowerCase()) {
        return res.json({ mensaje: "Respuesta correcta", contraseña: usuario.contraseña });
    } else {
        return res.status(400).json({ mensaje: "Respuesta de seguridad incorrecta" });
    }
};
