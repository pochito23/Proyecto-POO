import express,{ Express } from "express";
import cors from 'cors';



const app: Express = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

app.use(express.json())



app.listen(PORT, () => {
  console.log(`El servidor esta corriendo en el puerto ${PORT}`);
});
