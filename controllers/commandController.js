const { exec } = require("child_process");

exports.form = (req, res) => {

res.send(`

<link rel="stylesheet" href="/style.css">

<h1>Command Execution (vulnerable)</h1>

<form method="POST">
<input name="host" placeholder="Ping host">
<button>Execute</button>
</form>

<a href="/">Back</a>

`);
};

exports.vulnerable = (req, res) => {

const host = req.body.host;

exec("ping -c 2 " + host, (err, stdout) => {

res.send(`

<link rel="stylesheet" href="/style.css">

<h1>Result</h1>

<pre>${stdout}</pre>

<a href="/cmd">Back</a>

`);
});
};

exports.formSafe = (req, res) => {

res.send(`

<link rel="stylesheet" href="/style.css">

<h1>Command Execution (safe)</h1>

<form method="POST">
<input name="host" placeholder="Ping host">
<button>Execute</button>
</form>

<a href="/">Back</a>

`);
};

exports.safe = (req, res) => {

const host = req.body.host;

if (!/^[a-zA-Z0-9.-]+$/.test(host)) {

return res.send("Invalid host");
}

exec("ping -c 1 " + host, (err, stdout) => {

res.send(`

<link rel="stylesheet" href="/style.css">

<h1>Result</h1>

<pre>${stdout}</pre>

<a href="/cmd-safe">Back</a>

`);
});
};