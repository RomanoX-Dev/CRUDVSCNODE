const express = require('express'); 
const cors = require('cors');
const path = require('path')
const conexion = require('./conexion/conexion')
const aplicacion = express();
aplicacion.use(cors());
aplicacion.use(express.json());

aplicacion.use(express.static(path.join(__dirname, 'paginas')));

// Método CRUD - Guardar Producto
aplicacion.post('/productos', (req, res) => {
  const { nombre, precio, stock, proveedor } = req.body;
  const query = 'INSERT INTO productos (nombre, precio, stock, proveedor) VALUES (?,?,?,?)';
  
  
  conexion.query(query, [nombre, precio, stock, proveedor], (err, resultado) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ mensaje: 'Producto creado exitosamente', id: resultado.insertId });
  });
});


// // Método CRUD - Traer todo de productos
aplicacion.get('/productos', (req,res) => {
    const query = 'SELECT * FROM productos';
    
    conexion.query(query, (err, resultados) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(resultados); 
    });
});


// Metodo CRUD - Traer por ID
aplicacion.get('/productos/:id', (req, res) => {
    const { id } = req.params; 
    const query = 'SELECT * FROM productos WHERE id = ?';
    
    conexion.query(query, [id], (err, resultados) => {
        if (err) return res.status(500).json({ error: err.message });
        
        // Si no encuentra el producto, resultados estará vacío
        if (resultados.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        res.json(resultados[0]); // Devuelve el objeto del producto encontrado
    });
});


// Metodo CRUD - Actualizar producto
aplicacion.put('/productos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, precio, stock, proveedor } = req.body;
    const query = "UPDATE productos SET nombre = ?, precio = ?, stock = ?, proveedor = ? WHERE id = ?";
    
    conexion.query(query, [nombre, precio, stock, proveedor, id], (err, resultado) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado para actualizar' });
        }
        
        res.json({ mensaje: 'Producto actualizado exitosamente' });
    });
});


// Metodo CRUD - Eliminar un producto por su ID
aplicacion.delete('/productos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM productos WHERE id = ?';
    
    conexion.query(query, [id], (err, resultado) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: 'Producto no encontrado para eliminar' });
        }
        
        res.json({ mensaje: 'Producto eliminado exitosamente' });
    });
});






//
const PORT = 3000;
// El '0.0.0.0' aquí es lo que realmente importa y está muy bien configurado
aplicacion.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en todos los dispositivos. Puerto: ${PORT}`);
});