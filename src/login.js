// Ruta POST para login
router.post('/login', (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).send('Faltan datos.');
  }

  // Consulta con placeholders para evitar SQL injection
  const query = 'SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?';

  conexion.query(query, [correo, contrasena], (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).send('Error en el servidor.');
    }

    if (results.length > 0) {
      const usuario = results[0];

      // Guardar datos en sesión
      req.session.usuario = correo;
      req.session.nombre_completo = usuario.nombre_completo;
      req.session.ID_Usuario = usuario.id;

      // Redirigir a bienvenida (simulado)
      return res.redirect('/bienvenida');
    } else {
      // Usuario no encontrado - enviar alerta y redirigir (como en PHP)
      return res.send(`
        <script>
          alert("Usuario no existe, por favor verifique los datos introducidos");
          window.location.href = "/registro";
        </script>
      `);
    }
  });
});

module.exports = router;