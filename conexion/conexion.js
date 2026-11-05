const mysql = require('mysql2');

const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'inventario'
});
 
conexion.connect((err) => {
    if (err) return console.error('❌ Error MySQL:', err.message);
    console.log('🔌 Conectado a MySQL en XAMPP LOCAL.');
});

module.exports = conexion;
