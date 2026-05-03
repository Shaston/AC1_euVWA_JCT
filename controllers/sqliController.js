const db = require("../services/db");

exports.form = (req, res) => {
  res.send(`
    <link rel="stylesheet" href="/style.css">
    <h1>SQL Injection Login (vulnerable)</h1>

    <p><strong>Versión:</strong> vulnerable</p>
    <p>Usuario demo legítimo: <code>admin</code> / <code>admin123</code></p>
    <p>La consulta SQL se construye concatenando la entrada del usuario.</p>

    <form method="POST">
      <input name="username" placeholder="Username">
      <input name="password" type="password" placeholder="Password">
      <button>Login</button>
    </form>

    <p>Payload tipico de prueba en username: <code>' OR '1'='1' -- </code></p>

    <a href="/">Back</a>
  `);
};

exports.login = (req, res) => {
  const username = req.body.username || "";
  const password = req.body.password || "";

  const query =
    "SELECT id, username, role FROM users WHERE username = '" +
    username +
    "' AND password = '" +
    password +
    "'";

  db.get(query, (err, row) => {
    if (err) {
      return res.send(`
        <link rel="stylesheet" href="/style.css">
        <h1>SQL Injection Login (vulnerable)</h1>
        <p><strong>Versión:</strong> vulnerable</p>
        <p>Error en la consulta.</p>
        <pre>${query}</pre>
        <a href="/sqli-login">Back</a>
      `);
    }

    if (row) {
      return res.send(`
        <link rel="stylesheet" href="/style.css">
        <h1>SQL Injection Login (vulnerable)</h1>
        <p><strong>Versión:</strong> vulnerable</p>
        <p>Login correcto como <strong>${row.username}</strong> (${row.role}).</p>
        <p><strong>Consulta ejecutada:</strong></p>
        <pre>${query}</pre>
        <a href="/sqli-login">Back</a>
      `);
    }

    res.send(`
      <link rel="stylesheet" href="/style.css">
      <h1>SQL Injection Login (vulnerable)</h1>
      <p><strong>Versión:</strong> vulnerable</p>
      <p>Credenciales inválidas.</p>
      <p><strong>Consulta ejecutada:</strong></p>
      <pre>${query}</pre>
      <a href="/sqli-login">Back</a>
    `);
  });
};