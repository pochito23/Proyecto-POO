import mongoose from 'mongoose';

export const conectarDb = async () =>{
    try {
        await mongoose.connect("mongodb://localhost:27017/Clouder");
        console.log('Conectado a base de datos');
    } catch (error) {
        console.error(error)
    }
}

    