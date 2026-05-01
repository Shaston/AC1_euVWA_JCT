const { exec } = require("child_process");

exports.form = (req, res) => {
  res.send(`
    <link rel="stylesheet" href="/style.css">
    <h1>Blind Command Injection (vulnerable)</h1>

    <p><strong>Versión:</strong> vulnerable</p>
    <p>
      Introduce un host. La aplicación lanzará un comando del sistema y no mostrará
      la salida del comando, solo el tiempo total de respuesta.
    </p>

    <form method="POST">
      <input name="host" placeholder="Host o payload">
      <button>Ejecutar</button>
    </form>

    <p>Ejemplo: <code>127.0.0.1; sleep 5</code></p>

    <a href="/">Back</a>
  `);
};

exports.run = (req, res) => {
  const host = req.body.host || "";
  const startedAt = Date.now();

  exec("ping -c 1 " + host, { timeout: 8000 }, () => {
    const elapsed = Date.now() - startedAt;

    res.send(`
      <link rel="stylesheet" href="/style.css">
      <h1>Blind Command Injection (vulnerable)</h1>

      <p><strong>Versión:</strong> vulnerable</p>
      <p>Petición enviada.</p>
      <p><strong>Tiempo de respuesta:</strong> ${elapsed} ms</p>
      <p>No se muestra la salida del comando.</p>

      <a href="/blindcmd">Back</a>
    `);
  });
};