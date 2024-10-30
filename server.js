const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const pedidosRouter = require('./pedidos/pedidos'); // Asegúrate de que la ruta es correcta
const adminRouter = require('./admin/routes/adminRoutes'); // Importa el router de admin
const Plato = require('./models/Plato'); // Importa el modelo de Plato
const { router, cargarMesasDesdeDB } = require('./mesas/mesas'); // Importa la función cargarMesasDesdeDB

const app = express();
const PORT = 3000;

// Conexión a la base de datos
mongoose.connect('mongodb://localhost:27017/zaborfeten', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());

// Middleware para analizar el body de las peticiones
app.use(express.json());

// Middleware para cargar mesas desde la base de datos
app.use(async (req, res, next) => {
    try {
        req.mesas = await cargarMesasDesdeDB(); // Almacena las mesas en el objeto req
        next();
    } catch (error) {
        console.error('Error al cargar mesas:', error);
        res.status(500).json({ message: 'Error al cargar mesas.' });
    }
});


// Crear la carpeta 'simulaciones' si no existe
const simulacionesDir = path.join(__dirname, 'simulaciones');
if (!fs.existsSync(simulacionesDir)) {
    fs.mkdirSync(simulacionesDir);
}

// Ruta para la raíz
app.get('/', (req, res) => {
    res.send('API de ZaborFeten está funcionando');
});

// Ruta para obtener los platos
app.get('/api/platos', async (req, res) => {
    try {
        const platos = await Plato.find(); // Obtener todos los platos
        res.json(platos);
    } catch (error) {
        console.error('Error al obtener los platos:', error);
        res.status(500).send('Error al obtener los platos');
    }
});

// Usa el router de pedidos
app.use('/api/pedidos', pedidosRouter); 
app.use('/api/mesas', router);
app.use('/api/admin', adminRouter); // Usa el router de admin

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
