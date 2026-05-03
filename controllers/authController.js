exports.form = (req, res) => {
  res.send(`
    <link rel="stylesheet" href="/style.css">
    <h1>Broken Authentication (vulnerable)</h1>

    <p><strong>Versión:</strong> vulnerable</p>
    <p>
      Esta versión confia en parametros de URL para representar el estado autenticado.
    </p>

    <form method="POST">
      <input name="username" placeholder="Username">
      <input name="password" type="password" placeholder="Password">
      <button>Login</button>
    </form>

    <p>Bypass directo:</p>
    <code>/auth-vul/panel?user=admin&role=admin&auth=1</code>

    <br><br>
    <a href="/">Back</a>
  `);
};

exports.login = (req, res) => {
  const username = (req.body.username || "").trim();

  if (!username) {
    return res.send(`
      <link rel="stylesheet" href="/style.css">
      <h1>Broken Authentication (vulnerable)</h1>
      <p>Debes introducir un usuario.</p>
      <a href="/auth-vul/login">Back</a>
    `);
  }

  const role = username === "admin" ? "admin" : "user";

  res.redirect(
    `/auth-vul/panel?user=${encodeURIComponent(username)}&role=${encodeURIComponent(role)}&auth=1`
  );
};

exports.panel = (req, res) => {
  const user = req.query.user || "";
  const role = req.query.role || "";
  const auth = req.query.auth || "";

  if (auth === "1" && user) {
    return res.send(`
      <link rel="stylesheet" href="/style.css">
      <h1>Broken Authentication (vulnerable)</h1>
      <p><strong>Versión:</strong> vulnerable</p>
      <p>Acceso concedido a <strong>${user}</strong> con rol <strong>${role}</strong>.</p>
      <p>Estado autenticado tomado desde la URL.</p>
      <a href="/auth-vul/login">Logout</a>
    `);
  }

  res.status(401).send(`
    <link rel="stylesheet" href="/style.css">
    <h1>Broken Authentication (vulnerable)</h1>
    <p>No autenticado.</p>
    <a href="/auth-vul/login">Back</a>
  `);
};