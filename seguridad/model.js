/*jslint(unexpected_space_a_b)*/
/*jshint esversion: 9*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const INACTIVO = 0
const ACTIVO = 1
const PERMISO_ACTIVO_PRIMARIO = 1
const PERMISO_ACTIVO_SECUNDARIO = 2

// Esquema Mongoose para un Usuario que se enviará a la base de datos Mongo
var usuarioSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        maxlength: 8
    },
    nombre: {
        type: String,
        required: true,
        maxlength: 50
    },
    apellido: {
        type: String,
        maxlength: 50
    },
    password: {
        type: String,
        required: true
    },
    last_password: {
        type: String,
        default: null
    },
    fec_mod_pass:{
        type: Date,
        default: null
    },
    roles: {
        type: Schema.Types.ObjectId,
        ref: 'Rol',
        default: null
    },
    permisos: {
        type: Schema.Types.ObjectId,
        ref: 'Permiso',
        default: null
    },
    // ubicaciones: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Ubicacion'
    // },
    telefono: {
        type: String,
        maxlength: 30,
        default: null
    },
    ip:{
        type: String,
        maxlength: 255,
        default: null
    },
    email: {
        type: String,
        default: null
    },
    estado: {
        type: Number,
        default: ACTIVO
    },
    last_login: {
        type: Date,
        default: null
    },
    // info: {
    //     type: JSON,
    //     default: {}
    // },
    loggedIn: {
        type: Boolean,
        required: false,
        default: false
    },
    accesToken: {
        type: String,
        required: false,
        default: null
    },
    confirmCode: {
        type: String,
        required: false,
        maxlength: 8,
        default: null
    },
    createdDate: {
        type: Date,
        default: Date.now()
    },
    updatedDate: {
        type: Date,
        default: null
    }
});

usuarioSchema.set('toJSON', {
    virtuals: true
});

var itemMenuSchema = new Schema({
    nro_orden: {
        type: Number
    },
    responsable: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    titulo: {
        type: String,
        maxlength: 255
    },
    subtitulo: {
        type: String,
        maxlength: 255
    },
    icono: {
        type: String,
        maxlength: 255
    },
    permisos: {
        type: Schema.Types.ObjectId,
        ref: 'Permiso'
    },
    padre: {
        type: Schema.Types.ObjectId,
        ref: 'ItemMenu',
        default: null
    },
    comentarios: {
        type: String
    },
    estado: {
        type: Number,
        default: ACTIVO
    },
    createdDate: {
        type: Date,
        default: Date.now()
    }
});

itemMenuSchema.set('toJSON', {
    virtuals: true
});

var rolSchema = new Schema({
    descripciom: {
        type: String,
        maxlength: 255,
        unique: true
    },
    permisos: {
        type: Schema.Types.ObjectId,
        ref: 'Permiso',
        default: null
    },
    estado: {
        type: Number,
        default: ACTIVO
    },
    createdDate: {
        type: Date,
        default: Date.now()
    }
});

rolSchema.set('toJSON', {
    virtuals: true
});

var permisoSchema = new Schema({
    url: {
        type: String,
        maxlength: 255,
        unique: true
    },
    descripciom: {
        type: String,
        maxlength: 255,
        unique: true
    },
    estado: {
        type: Number,
        default: PERMISO_ACTIVO_PRIMARIO
    },
    createdDate: {
        type: Date,
        default: Date.now()
    }
});

permisoSchema.set('toJSON', {
    virtuals: true
});

const Usuario = mongoose.model('Usuario', usuarioSchema);
const ItemMenu = mongoose.model('ItemMenu', itemMenuSchema);
const Rol = mongoose.model('Rol', rolSchema);
const Permiso = mongoose.model('Permiso', permisoSchema);

module.exports = {
    Usuario,
    ItemMenu,
    Rol,
    Permiso
};