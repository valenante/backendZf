const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { mesas } = require('../mesas/mesas'); // Importar el objeto de mesas
const Pedido = require('../models/Pedido'); // Importar el modelo de Pedido
const Mesa = require('../models/Mesa'); // Ajusta la ruta según tu estructura de carpetas


// Ruta para crear un pedido
router.post('/crear-pedido', async (req, res) => {
    const { numeroMesa, productos, total, mensaje } = req.body;

    if (!numeroMesa) {
        return res.status(400).json({ message: "Número de mesa es requerido." });
    }

    try {
        const mesa = await Mesa.findOne({ numero: numeroMesa }); // Busca la mesa en la base de datos

        console.log(mesa); // Verifica que es un objeto de Mongoose

        if (!mesa || !mesa.abierta) {
            return res.status(400).json({ message: "La mesa no está abierta para pedidos o no existe." });
        }

        const nuevoPedido = new Pedido({
            mesa: numeroMesa,
            productos,
            total,
            mensaje,
        });

        await nuevoPedido.save(); // Guarda el nuevo pedido
        mesa.pedidos.push(nuevoPedido._id); // Agrega el pedido al array de la mesa
        await mesa.save(); // Guarda los cambios en la mesa

        return res.status(201).json({ message: "Pedido creado con éxito.", pedido: nuevoPedido });
    } catch (error) {
        console.error('Error al crear el pedido:', error);
        return res.status(500).json({ message: "Error interno del servidor." });
    }
});

router.get('/mesa/:idMesa', async (req, res) => {
    const idMesa = req.params.idMesa; // Obtener el ID directamente

    try {
        const mesa = await Mesa.findById(idMesa).populate({
            path: 'pedidos',
            populate: {
                path: 'productos.platoId', // Poblamos el modelo Plato
                select: 'nombre' // Solo seleccionamos el campo nombre
            }
        });
        
        if (!mesa) {
            return res.status(404).json({ message: 'Mesa no encontrada o no tiene pedidos.' });
        }

        return res.status(200).json({
            numeroMesa: mesa.numero,
            pedidos: mesa.pedidos,
            total: mesa.total,
        });
    } catch (error) {
        console.error('Error al obtener la mesa:', error);
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

module.exports = router;
