// crearClase.js
const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json()); // para datos tipo JSON
app.use(bodyParser.urlencoded({ extended: true })); // para datos tipo form

// Configurar sesión
app.use(session({
  secret: 'tu_clave_secreta',
  resave: false,
  saveUninitialized: true
}));

// Ruta para crear una clase
app.post('/crear-clase', (req, res) => {
  const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',//????
    password: '1234',
    database: 'eductechub'
  });

  conn.connect((err) => {
    if (err) {
      return res.json({ error: 'Error de conexión' });
    }

    const nombre = conn.escape(req.body.nombre);
    const seccion = conn.escape(req.body.seccion);
    const materia = conn.escape(req.body.materia);
    const aula = conn.escape(req.body.aula);
    const creador = conn.escape(req.session.nombre_completo || 'Anónimo');

    // Código generado
    const codigo = (req.body.materia || '').substring(0, 3).toUpperCase() + Math.floor(1000 + Math.random() * 9000);

    const sql = `INSERT INTO clases (nombre, seccion, materia, aula, creador, codigo)
                 VALUES (${nombre}, ${seccion}, ${materia}, ${aula}, ${creador}, '${codigo}')`;

    conn.query(sql, (error, result) => {
      if (error) {
        return res.json({ error: 'Error al crear la clase: ' + error.message });
      }

      res.json({
        success: true,
        nombre: req.body.nombre,
        seccion: req.body.seccion,
        materia: req.body.materia,
        aula: req.body.aula,
        creador: req.session.nombre_completo || 'Anónimo',
        codigo
      });
    });

    conn.end();
  });
});

// Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});