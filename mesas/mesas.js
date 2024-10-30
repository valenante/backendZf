const express = require('express');
const router = express.Router();
const Mesa = require('../models/Mesa'); // Importa el modelo de Mesa

// Función para cargar mesas desde la base de datos
async function cargarMesasDesdeDB() {
    try {
        const mesas = await Mesa.find().lean(); // Recuperar todas las mesas y convertir a un objeto plano
        return mesas.reduce((acc, mesa) => {
            acc[mesa.numero] = mesa; // Usar el número de mesa como clave
            return acc;
        }, {});
    } catch (error) {
        console.error('Error al cargar mesas desde la base de datos:', error);
        throw error; // Lanza el error para que lo maneje el middleware
    }
}

// Ruta para abrir una mesa
router.post('/abrir-mesa/:numeroMesa', async (req, res) => {
    const numeroMesa = parseInt(req.params.numeroMesa, 10);

    // Verifica si el número de mesa es válido
    if (isNaN(numeroMesa) || numeroMesa <= 0) {
        return res.status(400).json({ message: "Número de mesa no válido." });
    }

    try {
        // Busca la mesa en la base de datos
        const mesa = await Mesa.findOne({ numero: numeroMesa });

        // Imprimir el objeto mesa para ver si es válido
        console.log('Mesa encontrada:', mesa);

        // Si la mesa no está inicializada, devuelve un error
        if (!mesa) {
            return res.status(404).json({ message: "Mesa no encontrada." });
        }

        // Verifica si la mesa ya está abierta
        if (mesa.abierta) {
            return res.status(400).json({ message: `Mesa ${numeroMesa} ya está abierta.` });
        }

        // Abre la mesa
        mesa.abierta = true; // Actualiza el estado en la base de datos
        await mesa.save(); // Guarda los cambios en la base de datos

        return res.status(200).json({ message: `Mesa ${numeroMesa} abierta.` });
    } catch (error) {
        console.error('Error al abrir la mesa:', error);
        return res.status(500).json({ message: "Error interno del servidor." });
    }
});


// Ruta para cerrar una mesa
router.post('/cerrar-mesa/:numeroMesa', async (req, res) => {
    const numeroMesa = parseInt(req.params.numeroMesa, 10);

    try {
        // Busca la mesa en la base de datos
        const mesa = await Mesa.findOne({ numero: numeroMesa });

        // Si la mesa no está inicializada, devuelve un error
        if (!mesa) {
            return res.status(404).json({ message: "Mesa no encontrada." });
        }

        // Verifica si la mesa está abierta
        if (!mesa.abierta) {
            return res.status(400).json({ message: `Mesa ${numeroMesa} no está abierta o ya está pagada.` });
        }

        // Cambia el estado a pagada
        mesa.abierta = false; // o puedes agregar un campo `pagada` si prefieres
        await mesa.save(); // Guarda los cambios en la base de datos

        return res.status(200).json({ message: `Mesa ${numeroMesa} cerrada y pagada.` });
    } catch (error) {
        console.error('Error al cerrar la mesa:', error);
        return res.status(500).json({ message: "Error interno del servidor." });
    }
});

// Ruta para verificar si una mesa está abierta
router.get('/verificar-mesa/:numeroMesa', async (req, res) => {
    const numeroMesa = parseInt(req.params.numeroMesa, 10);

    try {
        // Busca la mesa en la base de datos
        const mesa = await Mesa.findOne({ numero: numeroMesa });

        if (!mesa) {
            return res.status(404).json({ message: "Mesa no encontrada." });
        }

        // Devuelve el estado de la mesa junto con su ID
        return res.status(200).json({
            _id: mesa._id, // Agregando el ID de la mesa
            abierta: mesa.abierta,
            message: mesa.abierta 
                ? `La mesa ${numeroMesa} ya está abierta.` 
                : `La mesa ${numeroMesa} no está abierta.`
        });
    } catch (error) {
        console.error('Error al verificar la mesa:', error);
        return res.status(500).json({ message: "Error interno del servidor." });
    }
});


// Ruta para mostrar todas las mesas
router.get('/mesas', async (req, res) => {
    try {
        // Consulta todas las mesas de la base de datos
        const estadoMesas = await Mesa.find({}, 'numero abierta total pedidos'); // Solo selecciona los campos necesarios

        res.status(200).json(estadoMesas);
    } catch (error) {
        console.error("Error al obtener el estado de las mesas:", error);
        res.status(500).json({ message: "Error al obtener el estado de las mesas" });
    }
});

module.exports = {router, cargarMesasDesdeDB}; // Exporta solo el router
