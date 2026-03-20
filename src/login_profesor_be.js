
router.post('/login-profesor', (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).send('Faltan datos');
  }

  const query = 'SELECT * FROM profesor WHERE correo = ? AND contrasena = ?';

  conexion.query(query, [correo, contrasena], (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).send('Error del servidor');
    }

    if (results.length > 0) {
      const profesor = results[0];
      // Guardar en sesión
      req.session.usuario = correo;
      req.session.ID_Profesor = profesor.id;
      req.session.tipo_usuario = 'profesor';

      return res.redirect('/bienvenida');
    } else {
      // Usuario no encontrado: mostrar alerta y redirigir
      return res.send(`
        <script>
          alert("usuario no existente, verifique los datos ingresados");
          window.location = "index.html";
        </script>
      `);
    }
  });
});

module.exports = router;