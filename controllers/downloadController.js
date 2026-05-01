const path = require("path");

const BASE_DIR = path.resolve(__dirname, "../files");
const ALLOWED_FILES = new Set([
  "fichero_public.txt"
]);

exports.form = (req, res) => {
  res.send(`
    <link rel="stylesheet" href="/style.css">
    <h1>Path Traversal / Arbitrary File Download (safe)</h1>

    <p><strong>Versión:</strong> secure</p>
    <p>
      Introduce un nombre de fichero permitido. La aplicación valida el fichero
      y comprueba que la ruta resuelta permanezca dentro del directorio autorizado.
    </p>

    <form method="POST">
      <input name="file" placeholder="Ej: fichero_public.txt">
      <button>Descargar</button>
    </form>

    <a href="/">Back</a>
  `);
};

exports.run = (req, res) => {
  const file = (req.body.file || "").trim();

  if (!ALLOWED_FILES.has(file)) {
    return res.send(`
      <link rel="stylesheet" href="/style.css">
      <h1>Path Traversal / Arbitrary File Download (safe)</h1>
      <p><strong>Versión:</strong> secure</p>
      <p>Fichero no permitido.</p>
      <a href="/download">Back</a>
    `);
  }

  const resolvedPath = path.resolve(BASE_DIR, file);

  if (!resolvedPath.startsWith(BASE_DIR + path.sep) && resolvedPath !== path.join(BASE_DIR, file)) {
    return res.send(`
      <link rel="stylesheet" href="/style.css">
      <h1>Path Traversal / Arbitrary File Download (safe)</h1>
      <p><strong>Versión:</strong> secure</p>
      <p>Ruta no válida.</p>
      <a href="/download">Back</a>
    `);
  }

  res.download(resolvedPath, (err) => {
    if (err) {
      return res.status(500).send(`
        <link rel="stylesheet" href="/style.css">
        <h1>Path Traversal / Arbitrary File Download (safe)</h1>
        <p><strong>Versión:</strong> secure</p>
        <p>Error descargando el archivo.</p>
        <a href="/download">Back</a>
      `);
    }
  });
};