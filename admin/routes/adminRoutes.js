const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Rutas de administración
router.post('/agregar-plato', adminController.agregarPlato); // Para agregar un nuevo plato
router.put('/modificar-plato/:id', adminController.modificarPlato); // Para modificar un plato existente
router.delete('/eliminar-plato/:id', adminController.eliminarPlato); // Para eliminar un plato
router.get('/platos', adminController.verPlatos); // Para ver todos los platos

module.exports = router;
