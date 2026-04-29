exports.form = (req, res) => {
  res.send(`
    <link rel="stylesheet" href="/style.css">
    <h1>DOM XSS (safe)</h1>

    <p><strong>Versión:</strong> secure</p>

    <p>Escribe algo y se reflejará en el DOM usando JavaScript seguro.</p>

    <input id="name" placeholder="Tu texto">
    <button onclick="run()">Mostrar</button>

    <div id="output" style="margin-top:20px;"></div>

    <script>
      function run() {
        const value = document.getElementById('name').value;
        document.getElementById('output').textContent = 'Hola ' + value;
      }
    </script>

    <a href="/">Back</a>
  `);
};