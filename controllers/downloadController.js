const path = require("path");

exports.form = (req, res) => {
  res.send(`
    <link rel="stylesheet" href="/style.css">
    <h1>Path Traversal / Arbitrary File Download (vulnerable)</h1>

    <p><strong>Versión:</strong> vulnerable</p>
    <p>
      Introduce un nombre de fichero. La aplicación descargará el archivo solicitado
      sin validar correctamente si se sale del directorio esperado.
    </p>

    <form method="POST">
      <input name="file" placeholder="Ej: fichero_public.txt">
      <button>Descargar</button>
    </form>

    <a href="/">Back</a>
  `);
};

exports.run = (req, res) => {
  const file = req.body.file || "";

  const filePath = path.join(__dirname, "../files", file);

  res.download(filePath, (err) => {
    if (err) {
      return res.status(500).send(`
        <link rel="stylesheet" href="/style.css">
        <h1>Path Traversal / Arbitrary File Download (vulnerable)</h1>
        <p><strong>Versión:</strong> vulnerable</p>
        <p>Error descargando el archivo.</p>
        <a href="/download">Back</a>
      `);
    }
  });
};