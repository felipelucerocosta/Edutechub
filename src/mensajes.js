// archivo: routes/mensajes.js
const express = require('express');
const router = express.Router();
const pool = require('../JS/conexion_be');

// Clase controladora
class MensajeController {
  static async guardar(req, res) {
    const { mensaje } = req.body;

    if (!mensaje || mensaje.trim() === '') {
      return res.status(400).send('Mensaje vacío');
    }

    try {
      await pool.query(
        'INSERT INTO tablon_mensajes (mensaje, fecha) VALUES ($1, NOW())',
        [mensaje]
      );
      res.sendStatus(200);
    } catch (err) {
      console.error('❌ Error al guardar mensaje:', err);
      res.status(500).send('Error al guardar el mensaje');
    }
  }

  static async mostrar(req, res) {
    try {
      const { rows } = await pool.query(`
        SELECT mensaje, fecha 
        FROM tablon_mensajes 
        ORDER BY id DESC 
        LIMIT 30
      `);

      let html = '';
      rows.forEach(row => {
        const fecha = new Date(row.fecha);
        const fechaFormateada = `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getFullYear()} ${fecha.getHours().toString().padStart(2, '0')}:${fecha.getMinutes().toString().padStart(2, '0')}`;
        const mensaje = MensajeController.escapeHtml(row.mensaje);
        html += `<div style='margin-bottom:10px;'><b>${fechaFormateada}:</b> ${mensaje}</div>`;
      });

      res.send(html);
    } catch (err) {
      console.error("❌ Error al obtener mensajes:", err);
      res.status(500).send("Error en el servidor.");
    }
  }

  static escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

// Rutas
router.post('/guardar-mensaje', MensajeController.guardar);
router.get('/mensajes', MensajeController.mostrar);

module.exports = router;