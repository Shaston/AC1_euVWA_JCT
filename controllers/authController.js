exports.form = (req, res) => {
  res.send(`
    <link rel="stylesheet" href="/style.css">
    <h1>Broken Authentication (safe)</h1>

    <p><strong>Versión:</strong> secure</p>
    <p>Usuario demo legitimo: <code>admin</code> / <code>admin123</code></p>

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

  if (username !== "admin" || password !== "admin123") {
    return res.status(401).send(`
      <link rel="stylesheet" href="/style.css">
      <h1>Broken Authentication (safe)</h1>
      <p><strong>Versión:</strong> secure</p>
      <p>Credenciales inválidas.</p>
      <a href="/auth-safe/login">Back</a>
    `);
  }

  req.session.regenerate((err) => {
    if (err) {
      return res.status(500).send(`
        <link rel="stylesheet" href="/style.css">
        <h1>Broken Authentication (safe)</h1>
        <p>Error interno.</p>
        <a href="/auth-safe/login">Back</a>
      `);
    }

    req.session.user = {
      username: "admin",
      role: "admin"
    };

    res.redirect("/auth-safe/panel");
  });
};

exports.panel = (req, res) => {
  if (!req.session.user) {
    return res.status(401).send(`
      <link rel="stylesheet" href="/style.css">
      <h1>Broken Authentication (safe)</h1>
      <p><strong>Versión:</strong> secure</p>
      <p>No autenticado.</p>
      <a href="/auth-safe/login">Back</a>
    `);
  }

  res.send(`
    <link rel="stylesheet" href="/style.css">
    <h1>Broken Authentication (safe)</h1>
    <p><strong>Versión:</strong> secure</p>
    <p>Acceso concedido a <strong>${req.session.user.username}</strong> con rol <strong>${req.session.user.role}</strong>.</p>
    <a href="/auth-safe/logout">Logout</a>
  `);
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("id");
    res.redirect("/auth-safe/login");
  });
};