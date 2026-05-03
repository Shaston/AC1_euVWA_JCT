const path = require("path");
const fs = require("fs");
const multer = require("multer");

const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, file.originalname)
});

const upload = multer({ storage });

exports.middleware = upload.single("file");

exports.form = (req, res) => {
  res.send(`
    <link rel="stylesheet" href="/style.css">
    <h1>Insecure File Upload (vulnerable)</h1>

    <p><strong>Versión:</strong> vulnerable</p>
    <p>
      Esta versión acepta archivos y los guarda con su nombre original en una carpeta accesible.
    </p>

    <form method="POST" enctype="multipart/form-data">
      <input type="file" name="file">
      <button>Subir</button>
    </form>

    <p>Prueba sugerida: subir un archivo <code>.html</code> con JavaScript embebido.</p>

    <a href="/">Back</a>
  `);
};

exports.upload = (req, res) => {
  if (!req.file) {
    return res.send(`
      <link rel="stylesheet" href="/style.css">
      <h1>Insecure File Upload (vulnerable)</h1>
      <p>No se ha subido ningun archivo.</p>
      <a href="/upload-vul">Back</a>
    `);
  }

  res.send(`
    <link rel="stylesheet" href="/style.css">
    <h1>Insecure File Upload (vulnerable)</h1>

    <p><strong>Versión:</strong> vulnerable</p>
    <p>Archivo subido: <strong>${req.file.originalname}</strong></p>
    <p>Ruta publica:</p>
    <p><a href="/uploads/${req.file.originalname}" target="_blank">/uploads/${req.file.originalname}</a></p>

    <a href="/upload-vul">Back</a>
  `);
};