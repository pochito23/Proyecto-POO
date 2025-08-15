import mongoose, { Document, Schema, Types } from 'mongoose';


    export interface Archivo extends Document {
  nombre: string;
  propietario: Number;
  carpetaPadre?: Types.ObjectId;
  fechaCreacion: Date;
  fechaModificacion: Date;
  tipo: 'carpeta' | 'proyecto' | 'snippet';
  
  codigoHTML?: string;
  codigoCSS?: string;
  codigoJS?: string;
  
  lenguaje?: string;
  codigo?: string;
  
  compartido: IPermisoCompartido[];
}
export interface IPermisoCompartido {
  usuario: Types.ObjectId;
  permisos: 'lectura' | 'escritura';
}
// Esquema de MongoDB
const folderSchema: Schema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    maxlength: [40, 'El nombre no puede exceder 40 caracteres']
  },
  propietario: {
    type: Number,
    ref: 'Usuario',
    required: [true, 'El propietario es requerido']
  },
  carpetaPadre: {
    type: Schema.Types.ObjectId,
    ref: 'Folder',
    default: null
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  fechaModificacion: {
    type: Date,
    default: Date.now
  },
  tipo: {
    type: String,
    enum: {
      values: ['carpeta', 'proyecto', 'snippet'],
      message: 'Tipo no válido'
    },
    required: [true, 'El tipo es requerido']
  },
  
  codigoHTML: {
    type: String,
    default: '',
    required: function(this: Archivo) {
      return this.tipo === 'proyecto';
    }
  },
  codigoCSS: {
    type: String,
    default: '',
    required: function(this: Archivo) {
      return this.tipo === 'proyecto';
    }
  },
  codigoJS: {
    type: String,
    default: '',
    required: function(this: Archivo) {
      return this.tipo === 'proyecto';
    }
  },
  
  lenguaje: {
    type: String,
    trim: true,
    required: function(this: Archivo) {
      return this.tipo === 'snippet';
    },
    enum: {
      values: ['html', 'css', 'javascript', 'typescript', 'python', 'java', 'php', 'sql', 'otros'],
      message: 'Lenguaje no válido'
    }
  },
  codigo: {
    type: String,
    required: function(this: Archivo) {
      return this.tipo === 'snippet';
    }
  },
  
  compartido: [{
    usuario: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true
    },
    permisos: {
      type: String,
      enum: {
        values: ['lectura', 'escritura'],
        message: 'Permiso no válido'
      },
      default: 'lectura'
    }
  }]
}, {
  timestamps: true,
  versionKey: false
});

// Índices para optimizar consultas
folderSchema.index({ propietario: 1 });
folderSchema.index({ carpetaPadre: 1 });
folderSchema.index({ tipo: 1 });
folderSchema.index({ propietario: 1, tipo: 1 });
folderSchema.index({ propietario: 1, carpetaPadre: 1 });
folderSchema.index({ 'compartido.usuario': 1 });

// Middleware para actualizar fechaModificacion antes de guardar
folderSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.fechaModificacion = new Date();
  }
  next();
});

// Validación: No permitir nombres duplicados en la misma carpeta del mismo propietario
folderSchema.index(
  { 
    nombre: 1, 
    propietario: 1, 
    carpetaPadre: 1 
  }, 
  { 
    unique: true,
    partialFilterExpression: { nombre: { $exists: true } }
  }
);

folderSchema.methods.tienePermiso = function(usuarioId: string, tipoPermiso: 'lectura' | 'escritura' = 'lectura'): boolean {
  if (this.propietario.toString() === usuarioId.toString()) {
    return true;
  }
  
  // Verificar en usuarios compartidos
  const permisoCompartido = this.compartido.find(
    (compartido: IPermisoCompartido) => compartido.usuario.toString() === usuarioId.toString()
  );
  
  if (!permisoCompartido) {
    return false;
  }
  
  if (tipoPermiso === 'lectura') {
    return true;
  }
  
  // Si pide escritura, debe tener permiso específico
  return permisoCompartido.permisos === 'escritura';
};

folderSchema.statics.contarProyectosUsuario = function(usuarioId: string): Promise<number> {
  return this.countDocuments({
    propietario: usuarioId,
    tipo: 'proyecto'
  });
};

// Export del modelo
export default mongoose.model<Archivo>('archivos', folderSchema,'archivos');