const path = require("path");
const fs = require("fs");
const multer = require("multer");

const uploadDir = path.join(__dirname, "../uploads_safe");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safeName = Date.now() + "-" + Math.random().toString(36).slice(2, 10) + ".txt";
    cb(null, safeName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".txt") {
      return cb(new Error("Solo se permiten archivos .txt"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 100
  }
});

exports.middleware = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      return res.send(`
        <link rel="stylesheet" href="/style.css">
        <h1>Insecure File Upload (safe)</h1>
        <p><strong>Versión:</strong> secure</p>
        <p>${err.message}</p>
        <a href="/upload-safe">Back</a>
      `);
    }
    next();
  });
};

exports.form = (req, res) => {
  res.send(`
    <link rel="stylesheet" href="/style.css">
    <h1>Insecure File Upload (safe)</h1>

    <p><strong>Versión:</strong> secure</p>
    <p>
      Esta versión solo permite archivos <code>.txt</code>, los renombra y los guarda fuera de una ruta pública directa.
    </p>

    <form method="POST" enctype="multipart/form-data">
      <input type="file" name="file">
      <button>Subir</button>
    </form>

    <a href="/">Back</a>
  `);
};

exports.upload = (req, res) => {
  if (!req.file) {
    return res.send(`
      <link rel="stylesheet" href="/style.css">
      <h1>Insecure File Upload (safe)</h1>
      <p><strong>Versión:</strong> secure</p>
      <p>No se ha subido ningun archivo.</p>
      <a href="/upload-safe">Back</a>
    `);
  }

  res.send(`
    <link rel="stylesheet" href="/style.css">
    <h1>Insecure File Upload (safe)</h1>

    <p><strong>Versión:</strong> secure</p>
    <p>Archivo aceptado y almacenado de forma controlada.</p>
    <p>Nombre original: <strong>${req.file.originalname}</strong></p>
    <p>Nombre almacenado: <strong>${req.file.filename}</strong></p>

    <a href="/upload-safe">Back</a>
  `);
};