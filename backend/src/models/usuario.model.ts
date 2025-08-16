import mongoose, {Document, Schema, Types} from 'mongoose';
import { type } from 'os';

export interface Usuario extends Document {
    correo: string,
    usuario: string,
    contraseña: string,
    plan: 'gratis'|'estudiante'|'pro'|'empresarial',
    preguntaSeguridad: '¿Cuál es el nombre de tu mascota?'|'¿Cómo se llamaba tu escuela primaria?'|'¿Cuál es el segundo nombre de tu madre?',
    respuestaSeguridad: string,
    numeroUsuario: number,
    img?: string,

}

//creando el schema
const usuarioSchema: Schema = new Schema({
  numeroUsuario: {
    type: Number,
    required: [true, 'El numero es requerido'],
    unique:true,
  },
    correo: {
    type: String,
    required: [true, 'El correo es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Formato de correo inválido']
  },
  usuario: {
    type: String,
    required: [true, 'El usuario es requerido'],
    unique: true,
    trim: true,
    minlength: [3, 'El usuario debe tener al menos 3 caracteres'],
    maxlength: [20, 'El usuario no puede exceder 20 caracteres']
  },
  contraseña: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  plan: {
    type: String,
    enum: {
      values: ['gratis', 'estudiante', 'pro', 'empresarial'],
      message: 'Plan no válido'
    },
    default: 'gratis'
  },
  preguntaSeguridad: {
    type: String,
    enum: {
      values: ['¿Cuál es el nombre de tu mascota?', '¿Cómo se llamaba tu escuela primaria?', '¿Cuál es el segundo nombre de tu madre?'],
      message: ' '
    },
    required: true
  },
  respuestaSeguridad: {
    type: String,
    required: [true, 'La respuesta de seguridad es requerida'],
    trim: true
  },
    img: {
    type: String,
    default: null,
    validate: {
      validator: function(v: string) {
        return !v || /^https?:\/\/.+/.test(v); // URL válida o null
      },
      message: 'La imagen debe ser una URL válida'
    }
  }
});

    usuarioSchema.methods.limiteProyectos = function(this: Usuario): number {
    const limites = {
        'gratis': 1,
        'estudiante': 5,
        'pro': 10,
        'empresarial': 100
        };
  return limites[this.plan];
};

usuarioSchema.methods.puedeCrearProyecto = async function(): Promise<boolean> {
  const Folder = mongoose.model('archivos');
  const proyectosActuales = await Folder.countDocuments({
    propietario: this._id,
    tipo: 'proyecto'
  });
  
  return proyectosActuales < this.limiteProyectos();
};

export default mongoose.model<Usuario>('usuarios', usuarioSchema, 'usuarios');