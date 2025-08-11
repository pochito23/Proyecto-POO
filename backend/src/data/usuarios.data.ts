import { Usuario } from "../models/usuario.model";

export const Usuarios: Array<Usuario> = [
    {
        id: 1,
        correo: "eduardo@gmail.com",
        contraseña: "1234",
        usuario: "eduardo",
        plan: "gratis",
        verificar: [
            {
                pregunta: "¿Cuál es el nombre de tu mascota?",
                respuesta: "chucho"
            }
        ]
    },
    {
        id: 2,
        correo: "Kevin@gmail.com",
        contraseña: "1234",
        usuario: "kevin",
        plan: "gratis",
        verificar: [
            {
                pregunta: "¿Cuál es el segundo nombre de tu madre?",
                respuesta: "..."
            }
        ]
    },
    {
        id: 3,
        correo: "Kristhian@gmail.com",
        contraseña: "1234",
        usuario: "kristiam",
        plan: "gratis",
        verificar: [
            {
                pregunta: "¿Cuál es el nombre de tu mascota?",
                respuesta: "chucho"
            }
        ]
    },
    {
        id: 4,
        correo: "Maria@gmail.com",
        contraseña: "1234",
        usuario: "maria",
        plan: "gratis",
        verificar: [
            {
                pregunta: "¿Cómo se llamaba tu escuela primaria?",
                respuesta: "uruguay"
            }
        ]
    },
    {
        id: 5,
        correo: "Jose@gmail.com",
        contraseña: "1234",
        usuario: "Pochito",
        plan: "Pro",
        verificar: [
            {
                pregunta: "¿Cómo se llamaba tu escuela primaria?",
                respuesta: "uruguay"
            }
        ]
    },
]