"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Esquema de MongoDB
const folderSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
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
        required: function () {
            return this.tipo === 'proyecto';
        }
    },
    codigoCSS: {
        type: String,
        default: '',
        required: function () {
            return this.tipo === 'proyecto';
        }
    },
    codigoJS: {
        type: String,
        default: '',
        required: function () {
            return this.tipo === 'proyecto';
        }
    },
    lenguaje: {
        type: String,
        trim: true,
        required: function () {
            return this.tipo === 'snippet';
        },
        enum: {
            values: ['html', 'css', 'javascript', 'typescript', 'python', 'java', 'php', 'sql', 'otros'],
            message: 'Lenguaje no válido'
        }
    },
    codigo: {
        type: String,
        required: function () {
            return this.tipo === 'snippet';
        }
    },
    compartido: [{
            usuario: {
                type: mongoose_1.Schema.Types.ObjectId,
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
folderSchema.pre('save', function (next) {
    if (this.isModified() && !this.isNew) {
        this.fechaModificacion = new Date();
    }
    next();
});
// Validación: No permitir nombres duplicados en la misma carpeta del mismo propietario
folderSchema.index({
    nombre: 1,
    propietario: 1,
    carpetaPadre: 1
}, {
    unique: true,
    partialFilterExpression: { nombre: { $exists: true } }
});
folderSchema.methods.tienePermiso = function (usuarioId, tipoPermiso = 'lectura') {
    if (this.propietario.toString() === usuarioId.toString()) {
        return true;
    }
    // Verificar en usuarios compartidos
    const permisoCompartido = this.compartido.find((compartido) => compartido.usuario.toString() === usuarioId.toString());
    if (!permisoCompartido) {
        return false;
    }
    if (tipoPermiso === 'lectura') {
        return true;
    }
    // Si pide escritura, debe tener permiso específico
    return permisoCompartido.permisos === 'escritura';
};
folderSchema.statics.contarProyectosUsuario = function (usuarioId) {
    return this.countDocuments({
        propietario: usuarioId,
        tipo: 'proyecto'
    });
};
// Export del modelo
exports.default = mongoose_1.default.model('archivos', folderSchema, 'archivos');
