const db = require("../services/db");

exports.form = (req, res) => {
  res.send(`
    <link rel="stylesheet" href="/style.css">
    <h1>SQL Injection Login (safe)</h1>

    <p><strong>Versión:</strong> secure</p>
    <p>Usuario demo legítimo: <code>admin</code> / <code>admin123</code></p>
    <p>La consulta usa parámetros y separación entre código SQL y datos.</p>

    <form method="POST">
      <input name="username" placeholder="Username">
      <input name="password" type="password" placeholder="Password">
      <button>Login</button>
    </form>

    <a href="/">Back</a>
  `);
};

exports.login = (req, res) => {
  const username = (req.body.username || "").trim();
  const password = (req.body.password || "").trim();

  if (username.length === 0 || password.length === 0 || username.length > 64 || password.length > 64) {
    return res.send(`
      <link rel="stylesheet" href="/style.css">
      <h1>SQL Injection Login (safe)</h1>
      <p><strong>Versión:</strong> secure</p>
      <p>Entrada inválida.</p>
      <a href="/sqli-login">Back</a>
    `);
  }

  const query = "SELECT id, username, role FROM users WHERE username = ? AND password = ?";

  db.get(query, [username, password], (err, row) => {
    if (err) {
      return res.send(`
        <link rel="stylesheet" href="/style.css">
        <h1>SQL Injection Login (safe)</h1>
        <p><strong>Versión:</strong> secure</p>
        <p>Error en la consulta.</p>
        <a href="/sqli-login">Back</a>
      `);
    }

    if (row) {
      return res.send(`
        <link rel="stylesheet" href="/style.css">
        <h1>SQL Injection Login (safe)</h1>
        <p><strong>Versión:</strong> secure</p>
        <p>Login correcto como <strong>${row.username}</strong> (${row.role}).</p>
        <p><strong>Consulta preparada:</strong></p>
        <pre>${query}</pre>
        <a href="/sqli-login">Back</a>
      `);
    }

    res.send(`
      <link rel="stylesheet" href="/style.css">
      <h1>SQL Injection Login (safe)</h1>
      <p><strong>Versión:</strong> secure</p>
      <p>Credenciales inválidas.</p>
      <p><strong>Consulta preparada:</strong></p>
      <pre>${query}</pre>
      <a href="/sqli-login">Back</a>
    `);
  });
};