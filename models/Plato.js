const mongoose = require('mongoose');

const platoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    precios: {
        racion: {
            type: Number,
            required: false // Cambia a false si no es obligatorio
        },
        tapa: {
            type: Number,
            required: false // Cambia a false si no es obligatorio
        },
        precio: {
            type: Number,
            required: false // Cambia a false si no es obligatorio
        }
    }
});

module.exports = mongoose.model('Plato', platoSchema);
