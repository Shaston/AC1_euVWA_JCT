const dns = require("dns").promises;

exports.form = (req, res) => {
  res.send(`
    <link rel="stylesheet" href="/style.css">
    <h1>Blind Command Injection (safe)</h1>

    <p><strong>Versión:</strong> secure</p>
    <p>
      Introduce un host. La aplicación validará el valor y usará una API nativa de Node
      en lugar de invocar comandos del sistema.
    </p>

    <form method="POST">
      <input name="host" placeholder="Dominio o IP">
      <button>Resolver</button>
    </form>

    <a href="/">Back</a>
  `);
};

exports.run = async (req, res) => {
  const host = (req.body.host || "").trim();
  const startedAt = Date.now();

  if (!/^[a-zA-Z0-9.-]+$/.test(host) || host.length > 253) {
    return res.send(`
      <link rel="stylesheet" href="/style.css">
      <h1>Blind Command Injection (safe)</h1>
      <p><strong>Versión:</strong> secure</p>
      <p>Host inválido.</p>
      <a href="/blindcmd-safe">Back</a>
    `);
  }

  try {
    await dns.lookup(host);
    const elapsed = Date.now() - startedAt;

    res.send(`
      <link rel="stylesheet" href="/style.css">
      <h1>Blind Command Injection (safe)</h1>

      <p><strong>Versión:</strong> secure</p>
      <p>Host válido/resuelto.</p>
      <p><strong>Tiempo de respuesta:</strong> ${elapsed} ms</p>

      <a href="/blindcmd-safe">Back</a>
    `);
  } catch {
    const elapsed = Date.now() - startedAt;

    res.send(`
      <link rel="stylesheet" href="/style.css">
      <h1>Blind Command Injection (safe)</h1>

      <p><strong>Versión:</strong> secure</p>
      <p>No se pudo resolver el host.</p>
      <p><strong>Tiempo de respuesta:</strong> ${elapsed} ms</p>

      <a href="/blindcmd-safe">Back</a>
    `);
  }
};