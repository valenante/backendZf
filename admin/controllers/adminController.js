
const Plato = require('../../models/Plato');


// Agregar un nuevo plato
exports.agregarPlato = async (req, res) => {
    const nuevoPlato = new Plato(req.body);
    try {
        await nuevoPlato.save();
        res.status(201).json({ message: 'Plato agregado correctamente.', plato: nuevoPlato });
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar el plato.', error });
    }
};

// Modificar un plato existente
exports.modificarPlato = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precios } = req.body; // Desestructuramos los valores del cuerpo
    console.log(precios)

    try {
        const platoModificado = await Plato.findByIdAndUpdate(
            id,
            { nombre, descripcion, precios }, // Asegúrate de que esto incluye los precios
            { new: true, runValidators: true } // Devuelve el nuevo documento y valida antes de guardar
        );

        if (!platoModificado) {
            return res.status(404).json({ message: 'Plato no encontrado.' });
        }

        res.json({
            message: 'Plato modificado correctamente.',
            plato: platoModificado
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al modificar el plato.', error });
    }
};
// Eliminar un plato
exports.eliminarPlato = async (req, res) => {
    const { id } = req.params;
    try {
        await Plato.findByIdAndDelete(id);
        res.json({ message: 'Plato eliminado correctamente.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el plato.', error });
    }
};

// Ver todos los platos
exports.verPlatos = async (req, res) => {
    try {
        const platos = await Plato.find();
        res.json(platos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los platos.', error });
    }
};
