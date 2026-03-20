const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const pool = require('./conexion_be');

// Registro de alumno
router.post('/registro-alumno', async (req, res) => {
  const { nombre_completo, correo, curso, DNI, contrasena } = req.body;

  if (!nombre_completo || !correo || !curso || !DNI || !contrasena) {
    return res.status(400).send("Datos incompletos.");
  }

  try {
    const verificarQuery = `SELECT * FROM usuarios WHERE correo = $1 OR DNI = $2`;
    const verificarResult = await pool.query(verificarQuery, [correo, DNI]);

    if (verificarResult.rows.length > 0) {
      return res.send("El correo o DNI ya está registrado.");
    }

    const insertUsuario = `
      INSERT INTO usuarios (contrasena, curso, nombre_completo, correo, DNI)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING ID_Usuario
    `;
    const usuarioResult = await pool.query(insertUsuario, [contrasena, curso, nombre_completo, correo, DNI]);
    const ID_Usuario = usuarioResult.rows[0].id_usuario;

    const [nombre, ...resto] = nombre_completo.split(' ');
    const apellido = resto.join(' ');

    const cursoResult = await pool.query(`SELECT ID_Curso FROM curso WHERE nombre_curso = $1`, [curso]);
    const ID_Curso = cursoResult.rows.length > 0 ? cursoResult.rows[0].id_curso : null;

    const insertAlumno = `
      INSERT INTO alumno (DNI, nombre, apellido, ID_Curso, ID_Usuario, correo)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    await pool.query(insertAlumno, [DNI, nombre, apellido, ID_Curso, ID_Usuario, correo]);

    res.send("¡Alumno registrado exitosamente!");

  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Error interno del servidor.");
  }
});

// Registro de profesor
router.post('/registro-profesor', async (req, res) => {
  const { nombre_completo, correo, materia, DNI, contrasena } = req.body;

  if (!nombre_completo || !correo || !materia || !DNI || !contrasena) {
    return res.status(400).send("Datos incompletos.");
  }

  try {
    const verificarQuery = `SELECT * FROM usuarios WHERE correo = $1 OR DNI = $2`;
    const verificarResult = await pool.query(verificarQuery, [correo, DNI]);

    if (verificarResult.rows.length > 0) {
      return res.send("El correo o DNI ya está registrado.");
    }

    const insertUsuario = `
      INSERT INTO usuarios (contrasena, usuario, nombre_completo, correo, DNI)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING ID_Usuario
    `;
    const usuarioResult = await pool.query(insertUsuario, [contrasena, correo, nombre_completo, correo, DNI]);
    const ID_Usuario = usuarioResult.rows[0].id_usuario;

    const insertProfesor = `
      INSERT INTO profesor (ID_Usuario, correo, DNI, nombre_completo, materia, contrasena)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    await pool.query(insertProfesor, [ID_Usuario, correo, DNI, nombre_completo, materia, contrasena]);

    res.send("¡Profesor registrado exitosamente!");

  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Error interno del servidor.");
  }
});

module.exports = router;