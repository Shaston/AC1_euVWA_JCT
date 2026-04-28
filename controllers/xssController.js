const escapeHtml = require("escape-html");

let comments = [];

exports.reflected = (req, res) => {

const name = req.query.name || "";

res.send(`

<link rel="stylesheet" href="/style.css">

<h1>Reflected XSS (vulnerable)</h1>

<form>
<input name="name">
<button>Send</button>
</form>

<p>Hello ${name}</p>

<a href="/">Back</a>

`);

};

exports.reflectedSafe = (req, res) => {

const name = escapeHtml(req.query.name || "");

res.send(`

<link rel="stylesheet" href="/style.css">

<h1>Reflected XSS (safe)</h1>

<form>
<input name="name">
<button>Send</button>
</form>

<p>Hello ${name}</p>

<a href="/">Back</a>

`);

};

exports.storedForm = (req, res) => {

const list = comments.map(c => `<li>${c}</li>`).join("");

res.send(`

<link rel="stylesheet" href="/style.css">

<h1>Stored XSS (vulnerable)</h1>

<form method="POST">
<input name="comment">
<button>Send</button>
</form>

<ul>${list}</ul>

`);

};

exports.stored = (req, res) => {

comments.push(req.body.comment || "");

res.redirect("/xss/stored");

};

exports.storedSafeForm = (req, res) => {

const list = comments
.map(c => `<li>${escapeHtml(c)}</li>`)
.join("");

res.send(`

<link rel="stylesheet" href="/style.css">

<h1>Stored XSS (safe)</h1>

<form method="POST">
<input name="comment">
<button>Send</button>
</form>

<ul>${list}</ul>

`);

};

exports.storedSafe = (req, res) => {

comments.push(req.body.comment || "");

res.redirect("/xss/stored-safe");

};