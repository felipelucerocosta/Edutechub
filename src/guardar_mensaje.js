// archivo: routes/guardarMensaje.js
const express = require('express');
const router = express.Router();
const conexion = require('../db/conexion'); // ⬅️ Usa la conexión compartida

router.post('/guardar-mensaje', (req, res) => {
  const mensaje = req.body.mensaje;

  if (!mensaje || mensaje.trim() === '') {
    return res.status(400).send('Mensaje vacío');
  }

  const query = 'INSERT INTO tablon_mensajes (mensaje, fecha) VALUES (?, NOW())';

  conexion.query(query, [mensaje], (err) => {
    if (err) {
      console.error('❌ Error al guardar mensaje:', err);
      return res.status(500).send('Error al guardar el mensaje');
    }
    res.sendStatus(200); // OK
  });
});

module.exports = router;