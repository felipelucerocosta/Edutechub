// unirseClase.js
const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Ruta POST para unirse a una clase
app.post('/unirse-clase', (req, res) => {
  // Verificar si el alumno está logueado
  if (!req.session.alumno_id) {
    return res.send("Debes iniciar sesión como alumno.");
  }

  const alumno_id = req.session.alumno_id;
  const materia = req.body.materia || '';
  const codigo = req.body.codigo || '';

  if (!materia || !codigo) {
    return res.send("Datos incompletos.");
  }

  // Verificar si ya está unido a la clase
  const verificarSql = `
    SELECT * FROM alumnos_clases 
    WHERE alumno_id = ? AND materia = ?
  `;

  conexion.query(verificarSql, [alumno_id, materia], (err, results) => {
    if (err) {
      return res.send("Error en la base de datos.");
    }

    if (results.length > 0) {
      return res.send(`Ya estás unido a la clase de ${materia}.`);
    }

    // Insertar la relación
    const insertSql = `
      INSERT INTO alumnos_clases (alumno_id, materia, codigo) 
      VALUES (?, ?, ?)
    `;

    conexion.query(insertSql, [alumno_id, materia, codigo], (insertErr) => {
      if (insertErr) {
        return res.send("Error al unirse a la clase.");
      }
      res.send(`¡Te has unido a la clase de ${materia}!`);
    });
  });
});

// Iniciar servidor
app.listen(3000, () => {
  console.log("Servidor escuchando en http://localhost:3000");
});