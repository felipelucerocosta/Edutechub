// archivo: routes/mostrarMensajes.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql');


// Ruta para obtener mensajes del tablón
router.get('/mensajes', (req, res) => {
  const sql = `
    SELECT mensaje, fecha 
    FROM tablon_mensajes 
    ORDER BY id DESC 
    LIMIT 30
  `;

  conexion.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error al obtener mensajes:", err);
      return res.status(500).send("Error en el servidor.");
    }

    // Construir HTML (igual que en PHP)
    let html = '';
    results.forEach(row => {
      const fecha = new Date(row.fecha);
      const fechaFormateada = `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth()+1).toString().padStart(2, '0')}/${fecha.getFullYear()} ${fecha.getHours().toString().padStart(2, '0')}:${fecha.getMinutes().toString().padStart(2, '0')}`;
      const mensaje = escapeHtml(row.mensaje);
      html += `<div style='margin-bottom:10px;'><b>${fechaFormateada}:</b> ${mensaje}</div>`;
    });

    res.send(html);
  });
});

// Función para escapar HTML (similar a htmlspecialchars en PHP)
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

module.exports = router;