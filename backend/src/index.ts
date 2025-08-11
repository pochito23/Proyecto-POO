import express, { Express } from "express";
import cors from 'cors';

const app = express();
app.use(cors()); //Cors

app.get('/', (req, res) => {
    res.send('API en funcionamiento');
})

app.listen(3107, () => {
    console.log("Servidor funcionando en el puerto");
});