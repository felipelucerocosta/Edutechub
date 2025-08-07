// db/conexion.js
const { Pool } = require('pg');

// Configura los datos de tu servidor PostgreSQL
const pool = new Pool({
  host: 'localhost',
  user: 'postgres',       // usuario por defecto creo
  password: '1234', // Cambia por tu contraseña
  database: 'eductechub', // Tu base de datos
  port: 5432              // Puerto por defecto de PostgreSQL
});

pool.connect()
  .then(() => {
    console.log('✅ Conectado a la base de datos PostgreSQL.');
  })
  .catch((err) => {
    console.error('❌ Error de conexión a la base de datos:', err.message);
  });

module.exports = pool;