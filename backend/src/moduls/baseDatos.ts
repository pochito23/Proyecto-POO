import mongoose from 'mongoose';

const servidor: string = "localhost:27017";
const nombreBaseDatos: string = "netflix";

class Database {
    constructor() {
        this.conectar();
    }

    async conectar(): Promise<void> {
        try {
            await mongoose.connect(`mongodb://${servidor}/${nombreBaseDatos}`);
            console.log("Se conectó a la base de datos");
        } catch (error: unknown) {
            console.error(JSON.stringify(error));
        }
    }
}

export = new Database();