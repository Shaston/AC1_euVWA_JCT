exports.debug = (req, res) => {
  res.send(`
    <link rel="stylesheet" href="/style.css">
    <h1>Security Misconfiguration (vulnerable)</h1>

    <p><strong>Versión:</strong> vulnerable</p>
    <p>Este endpoint expone info interna de configuracion.</p>

    <pre>${JSON.stringify({
      node_env: process.env.NODE_ENV || "development",
      port: process.env.PORT || 3000,
      cwd: process.cwd(),
      platform: process.platform,
      pid: process.pid
    }, null, 2)}</pre>

    <a href="/">Back</a>
  `);
};

exports.crash = (req, res, next) => {
  next(new Error("Fallo interno de prueba: stack trace expuesto"));
};