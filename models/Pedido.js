const mongoose = require('mongoose');

const PedidoSchema = new mongoose.Schema({
    mesa: {
        type: Number,
        required: true,
    },
    productos: [{
        platoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Plato', // Referencia al modelo Plato
            required: true,
        },
        cantidad: {
            type: Number,
            required: true,
        },
    }],
    total: {
        type: Number,
        required: true,
    },
    mensaje: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Pedido = mongoose.model('Pedido', PedidoSchema);

module.exports = Pedido;
