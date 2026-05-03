exports.info = (req, res) => {
  res.send(`
    <link rel="stylesheet" href="/style.css">
    <h1>Security Misconfiguration (safe)</h1>

    <p><strong>Versión:</strong> secure</p>
    <p>La aplicación no expone endpoints de debug internos ni detalles innecesarios de configuración.</p>

    <a href="/">Back</a>
  `);
};

exports.crash = (req, res, next) => {
  next(new Error("Fallo interno controlado"));
};