export interface Usuario {
    id: number,
    correo: string,
    contraseña: string,
    usuario: string,
    plan: string,
    verificar: Array<Pregunta>,
    
}

export interface Pregunta {
    pregunta: string,
    respuesta: string
}
