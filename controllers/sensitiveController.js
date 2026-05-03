const { randomBytes, scryptSync } = require("node:crypto");

const salt = randomBytes(16).toString("hex");
const passwordHash = scryptSync("admin123", salt, 64).toString("hex");

function maskCard(number) {
  return "**** **** **** " + number.slice(-4);
}

function maskSecret(value) {
  if (!value || value.length < 8) return "********";
  return value.slice(0, 4) + "..." + value.slice(-4);
}

const safeUser = {
  username: "admin",
  email: "admin@example.local",
  passwordHash: `scrypt$${salt}$${passwordHash}`,
  cardNumberMasked: maskCard("4111111111111111"),
  apiKeyMasked: maskSecret("sk_live_demo_ABCDEF1234567890"),
  personalNote: "[redacted]"
};

exports.profile = (req, res) => {
  res.send(`
    <link rel="stylesheet" href="/style.css">
    <h1>Sensitive Data Exposure (safe)</h1>

    <p><strong>Versión:</strong> secure</p>
    <p>Esta versión minimiza la exposición de datos sensibles y sustituye la contraseña en claro por un hash derivado con scrypt.</p>

    <pre>${JSON.stringify(safeUser, null, 2)}</pre>

    <a href="/">Back</a>
  `);
};