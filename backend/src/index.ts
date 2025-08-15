import express,{ Express } from "express";
import cors from 'cors';
import usuariosRouter from './routes/usuario.router'
import archivosRouter from './routes/archivos.router'
import { conectarDb } from "./moduls/baseDatos";


const app: Express = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

app.use(express.json())
conectarDb().then(()=>{
app.listen(PORT, () => {
  console.log(`El servidor esta corriendo en el puerto ${PORT}`);
});
})
app.use('/usuarios', usuariosRouter);
app.use('/archivos',archivosRouter)

