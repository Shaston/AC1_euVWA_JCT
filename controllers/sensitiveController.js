const demoUser = {
  username: "admin",
  email: "admin@example.local",
  password: "admin123",
  backupPasswordB64: Buffer.from("admin123").toString("base64"),
  cardNumber: "4111111111111111",
  apiKey: "sk_live_demo_ABCDEF1234567890",
  personalNote: "dni=12345678Z; salary=5500"
};

exports.profile = (req, res) => {
  res.send(`
    <link rel="stylesheet" href="/style.css">
    <h1>Sensitive Data Exposure (vulnerable)</h1>

    <p><strong>Versión:</strong> vulnerable</p>
    <p>version que expone datos sensibles en claro y utiliza una codificación débil para la contraseña de backup.</p>

    <pre>${JSON.stringify(demoUser, null, 2)}</pre>

    <a href="/">Back</a>
  `);
};