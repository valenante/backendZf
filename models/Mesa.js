const mongoose = require('mongoose');

// Definición del esquema para la mesa
const mesaSchema = new mongoose.Schema({
    numero: {
        type: Number,
        required: true,
        unique: true, // Asegura que no haya dos mesas con el mismo número
    },
    abierta: {
        type: Boolean,
        default: false, // Por defecto, la mesa está cerrada
    },
    ubicacion: {
        type: String,
        required: true, // Si necesitas que la ubicación sea obligatoria
    },
    pedidos: [{ 
        type: mongoose.Schema.Types.ObjectId, // Referencia a los IDs de los pedidos
        ref: 'Pedido' // El modelo de los pedidos
    }]
}, {
    timestamps: true, // Agrega campos de fecha de creación y actualización
});

// Crea el modelo a partir del esquema
const Mesa = mongoose.model('Mesa', mesaSchema);

module.exports = Mesa;
