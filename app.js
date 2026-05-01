// Importa el framework Express para crear el servidor web
const express = require("express");

// Importa las rutas relacionadas con vulnerabilidades XSS
const xssRoutes = require("./routes/xss");

// nuevo para domxss
const domxssRoutes = require("./routes/domxss");

// Importa las rutas relacionadas con ejecución de comandos
const commandRoutes = require("./routes/command");

// Importa las rutas relacionadas con inclusión/lectura de ficheros
const fileRoutes = require("./routes/file");

// Importa las rutas con ejecucion de command execution
const blindCmdRoutes = require("./routes/blindcmd");

// Inicializa la aplicación Express
const app = express();

// Define el puerto en el que correrá el servidor
//1º para pruebas-> const PORT = process.env.PORT || 3000; original->  const PORT = 3000;
const PORT = process.env.PORT || 3000;

// Middleware para parsear datos enviados en formularios (application/x-www-form-urlencoded)
// extended: true permite usar objetos complejos (basado en qs)
app.use(express.urlencoded({ extended: true }));

// Middleware para servir archivos estáticos desde el directorio "public"
// Por ejemplo: CSS, imágenes, JS del frontend
app.use(express.static("public"));

// Define la ruta raíz "/"
app.get("/", (req, res) => {

    // Envía una respuesta HTML directamente al cliente
    res.send(`

<link rel="stylesheet" href="/style.css">

<h1>UE Web Security Lab</h1>
<p><strong>Versión activa:</strong> vulnerable</p>

<h2>XSS</h2>
<ul>
<li><a href="/xss/reflected">Reflected XSS</a></li>
<li><a href="/xss/stored">Stored XSS</a></li>
<li><a href="/xss/reflected-safe">Reflected XSS (safe)</a></li>
<li><a href="/xss/stored-safe">Stored XSS (safe)</a></li>
<li><a href="/domxss">DOM XSS Vul</a></li>
</ul>

<h2>Command Execution</h2>
<ul>
<li><a href="/cmd">Command Execution</a></li>
<li><a href="/cmd-safe">Command Execution (safe)</a></li>
<li><a href="/blindcmd">Blind Command Injection Vul</a></li>
</ul>

<h2>File Inclusion</h2>
<ul>
<li><a href="/file">File Viewer</a></li>
<li><a href="/file-safe">File Viewer (safe)</a></li>
</ul>

`);
});

// Monta las rutas XSS bajo el prefijo "/xss"
// Ejemplo: /xss/reflected
app.use("/xss", xssRoutes);

// Monta las rutas de blindcmd en la raiz
app.use("/", blindCmdRoutes);

// nuevo de domxss
app.use("/domxss", domxssRoutes);

// Monta las rutas de commandRoutes en la raíz "/"
// (las rutas internas ya definen sus paths, como /cmd, /cmd-safe)
app.use("/", commandRoutes);

// Monta las rutas de fileRoutes en la raíz "/"
// (ej: /file, /file-safe)
app.use("/", fileRoutes);

// Inicia el servidor y lo pone a escuchar en el puerto definido
app.listen(PORT, () => {
    // Muestra en consola la URL de acceso
    console.log("Server running on http://localhost:" + PORT);
});