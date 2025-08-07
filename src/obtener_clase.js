
// Ruta GET para obtener clases
router.get('/clases', (req, res) => {
  conexion.query(
    'SELECT nombre, seccion, materia, aula, creador, codigo FROM clases ORDER BY id DESC',
    (err, results) => {
      if (err) {
        console.error('❌ Error al consultar clases:', err);
        return res.json([]);
      }
      res.json(results);
    }
  );
});

module.exports = router;