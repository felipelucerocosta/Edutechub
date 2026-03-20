
const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'eductechub'
});

router.post('/login', (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).send('Faltan datos');
  }

  // Hash SHA-512 como en PHP
  const hashedPassword = crypto.createHash('sha512').update(contrasena).digest('hex');

  const query = 'SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?';

  conexion.query(query, [correo, hashedPassword], (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).send('Error en el servidor');
    }

    if (results.length > 0) {
      req.session.usuario = correo;
      return res.redirect('/bienvenida');
    } else {
      return res.send(`
        <script>
          alert("usuario no existente, verifique los datos ingresados");
          window.location = "index.php";
        </script>
      `);
    }
  });
});

module.exports = router;