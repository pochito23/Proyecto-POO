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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
//creando el schema
const usuarioSchema = new mongoose_1.Schema({
    numeroUsuario: {
        type: Number,
        required: [true, 'El numero es requerido'],
        unique: true,
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
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});
usuarioSchema.methods.limiteProyectos = function () {
    const limites = {
        'gratis': 1,
        'estudiante': 5,
        'pro': 10,
        'empresarial': 100
    };
    return limites[this.plan];
};
usuarioSchema.methods.puedeCrearProyecto = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const Folder = mongoose_1.default.model('Folder');
        const proyectosActuales = yield Folder.countDocuments({
            propietario: this._id,
            tipo: 'proyecto'
        });
        return proyectosActuales < this.LimiteProyectos();
    });
};
exports.default = mongoose_1.default.model('Usuario', usuarioSchema, 'Usuarios');
