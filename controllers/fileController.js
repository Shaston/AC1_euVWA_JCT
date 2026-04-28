const fs = require("fs");
const path = require("path");

exports.form = (req, res) => {

res.send(`

<link rel="stylesheet" href="/style.css">

<h1>File Viewer (vulnerable)</h1>

<form method="POST">
<input name="file" placeholder="Filename">
<button>Open</button>
</form>

<a href="/">Back</a>

`);
};

exports.vulnerable = (req, res) => {

const file = req.body.file;

const filePath = "files/" + file;

try {

const content = fs.readFileSync(filePath, "utf8");

res.send(`

<link rel="stylesheet" href="/style.css">

<h1>File Content</h1>

<pre>${content}</pre>

`);

} catch {

res.send("Error reading file");

}

};

exports.formSafe = (req, res) => {

res.send(`

<link rel="stylesheet" href="/style.css">

<h1>File Viewer (safe)</h1>

<form method="POST">
<input name="file" placeholder="Filename">
<button>Open</button>
</form>

<a href="/">Back</a>

`);
};

exports.safe = (req, res) => {

const allowed = ["fichero_public.txt"];

const file = req.body.file;

if (!allowed.includes(file)) {

return res.send("File not allowed");
}

const filePath = path.join(__dirname, "../files", file);

const content = fs.readFileSync(filePath, "utf8");

res.send(`

<link rel="stylesheet" href="/style.css">

<h1>File Content</h1>

<pre>${content}</pre>

`);
};