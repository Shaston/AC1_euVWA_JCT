# AC1_euVWA_JCT
Damn Vulnerable Web Application (DVWA) a un entorno moderno basado en Node.js + Express, creando la aplicación euVWA


para iniciar la app en el directorio raiz npm start o node app.js
Ultimos cambios añadidos, tema de puertos y las pruebas en ramas sec y vul para no tener que arrancar y para el server
En app.js const PORT = process.env.PORT || 3000;
Y luego ya por ej para los servidores PORT=3001 npm start en vul y PORT=3002 npm start en secure, aunque a luego llego a usar NODE_ENV=production PORT=3002 npm

LAS RAMA main SE UTILIZA COMO DOCUMENTACION Y PUNTO DE ENTRADA AL REPO. EL CODIGO FUENTE FINAL, ESTA EN main-vulnerable Y main-secure, LAS 2 RAMAS INDEPENDIENTES O DIFERENCIADAS QUE SE PEDIA.

1. La aplicación mantiene una estructura modular mediante:

app.js
routes/
controllers/
services/
public/
files/
data/

Base inicial del laboratorio Node.js + Express funcionando en local.

## Plan de vulnerabilidades

Las 8 vulnerabilidades planificadas para la actividad son:

1. DOM-based XSS
2. Blind Command Injection
3. Path Traversal / Arbitrary File Download
4. SQL Injection
5. Insecure File Upload
6. Broken Authentication
7. Sensitive Data Exposure / Cryptographic Failures
8. Security Misconfiguration
---

2. Ramas principales del proyecto

main-vulnerable

Versión vulnerable de la aplicación, con todas las vulnerabilidades activas y demostrables.

main-secure

Versión securizada con las mismas funcionalidades, pero corregidas mediante validación, parametrización, control de sesión, enmascarado de datos, manejo seguro de errores, etc.

---

3. Tecnologías utilizadas

Node.js
Express
SQLite3
express-session
Multer
JavaScript
HTML/CSS

---

4. Instalación y ejecución

4.1. Requisitos previos

Node.js instalado
npm instalado
Git

4.2. Clonar el repositorio (el main es la base, las ramas vulnerable y safe estan independientes)

git clone https://github.com/Shaston/AC1_euVWA_JCT/tree/main
cd AC1_euVWA_JCT

4.3. Ejecutar la versión vulnerable

git checkout main-vulnerable
npm install
PORT=3001 npm start

Acceso: http://localhost:3001

4.4. Ejecutar la versión segura

git checkout main-secure
npm install
NODE_ENV=production PORT=3002 npm start

Acceso:  http://localhost:3002

A destacar que se usan puertos diferentes para comparar ambas versiones en paralelo en las pruebas, para no tener que estar parando y arrancando. 


5. Tabla comparativa de correcciones aplicadas

INSERTAR TABLA (del punto 6)



6. Evidencias y explotación de las vulnerabilidades

6.1 Módulo 1 — DOM-based XSS

Categoría:OWASP Top 10 - Injection / XSS  

**Descripción**

Se implementa una funcionalidad que refleja dinámicamente texto introducido por el usuario en el DOM.

En la versión vulnerable se usa innerHTML.
En la versión segura se usa textContent.

**Version vulnerable**
La versión vulnerable inserta la entrada del usuario usando 'innerHTML'.  
Esto permite que el navegador interprete la entrada como HTML y ejecute código inyectado, provocando una vulnerabilidad de tipo DOM-based XSS.

**Versión segura**
La versión segura inserta la entrada del usuario usando 'textContent'.  
De este modo, la entrada se trata como texto plano y no como HTML interpretable, evitando la ejecución del payload en este contexto.

**Pruebas realizadas**  
Payload de prueba 1:
<b>hola</b>

Payload 2 (ejecución JavaScript):
<img src=x onerror=alert('XSS')>

Vulnerable

<b>hola</b> se renderiza en negrita.
<img src=x onerror=alert('XSS')> ejecuta el alert.

INSERTAR IMAGENES

Segura

Ambos payloads se muestran como texto.
No se ejecuta JavaScript.

INSERTAR IMAGENES

---

### Módulo 2 completado: Blind Command Injection

**Categoría:** OWASP Top 10 - Injection / OS Command Injection  
**Estado:** completado en versión vulnerable y versión segura

**Descripción funcional**  
Se ha añadido un nuevo módulo `Blind Command Injection` para demostrar una inyección ciega por tiempo.  
Ambas versiones mantienen la misma idea funcional: el usuario introduce un host y la aplicación devuelve una respuesta indicando el resultado de la operación.

**Versión vulnerable**  
La versión vulnerable construye un comando del sistema concatenando directamente la entrada del usuario.  
No muestra la salida del comando, pero sí el tiempo de respuesta, lo que permite demostrar una blind command injection mediante retardos artificiales.

**Versión segura**  
La versión segura valida el valor recibido y evita por completo invocar comandos del sistema.  
En su lugar utiliza `dns.lookup()` como API nativa de Node.js para resolver el host, reduciendo de forma clara la superficie de ataque.

**Prueba realizada**  
Payload de prueba:

127.0.0.1; sleep 5

---

### Módulo 3 completado: Path Traversal / Arbitrary File Download

**Categoría:** OWASP Top 10 - File Inclusion / Path Traversal  
**Estado:** completado en versión vulnerable y versión segura

**Descripción funcional**  
Se ha añadido un nuevo módulo de descarga de ficheros.  
Ambas versiones permiten solicitar un archivo para su descarga, pero difieren en la forma de validar el nombre y la ruta solicitada.

**Versión vulnerable**  
La versión vulnerable construye la ruta de descarga a partir de la entrada del usuario sin validación suficiente.  
Esto permite descargar archivos fuera del directorio previsto mediante secuencias de path traversal.

**Versión segura**  
La versión segura limita los nombres permitidos mediante una allowlist y resuelve la ruta final con `path.resolve()`, comprobando que permanezca dentro del directorio autorizado antes de descargar el fichero.

**Pruebas realizadas**  
Payload de prueba 1:

../package.json


### Módulo 4 completado: SQL Injection Login

**Categoría:** OWASP Top 10 - Injection / SQL Injection  
**Estado:** completado en versión vulnerable y versión segura

**Descripción funcional**  
Se ha añadido un módulo de autenticación simple basado en SQLite.  
Ambas versiones permiten iniciar sesión con un usuario de prueba (`admin / admin123`), pero difieren en la forma de construir la consulta SQL.

**Versión vulnerable**  
La versión vulnerable concatena directamente la entrada del usuario dentro de la sentencia SQL.  
Esto permite alterar la consulta y provocar un bypass de autenticación mediante SQL Injection.

**Versión segura**  
La versión segura utiliza consultas parametrizadas (`?`) con binding de valores, separando claramente la lógica SQL de los datos suministrados por el usuario.  
Además, aplica una validación básica de entrada.

**Pruebas realizadas**  
Prueba legítima:

admin/admin123

Prueba owasp

' OR '1'='1' -- / loquesea

---

### Módulo 5 completado: Insecure File Upload

**Categoría:** OWASP Top 10 - Insecure File Upload  
**Estado:** completado en versión vulnerable y versión segura

**Descripción funcional**  
Se ha añadido un módulo de subida de archivos.  
Ambas versiones permiten subir un archivo, pero difieren en las validaciones aplicadas y en la forma de almacenarlo/publicarlo.

**Versión vulnerable**  
La versión vulnerable acepta archivos sin restricciones suficientes, conserva el nombre original y los deja accesibles desde una ruta pública servida por la aplicación.  
Esto permite subir contenido activo, como un archivo HTML con JavaScript embebido, y ejecutarlo posteriormente desde el navegador.

**Versión segura**  
La versión segura solo permite archivos `.txt`, aplica límite de tamaño, renombra el archivo antes de almacenarlo y no lo expone mediante una ruta pública directa.

**Pruebas realizadas**  
Prueba 1:
- Se subió un archivo `prueba.html` con contenido HTML y JavaScript.
- En la versión vulnerable el archivo quedó accesible en `/uploads/prueba.html` y su contenido se ejecutó al abrirlo.

Prueba 2:
- Se intentó subir el mismo archivo `prueba.html` en la versión segura.
- La subida fue rechazada al no cumplir la extensión permitida.

Prueba 3:
- Se subió un archivo `nota.txt` en la versión segura.
- El archivo fue aceptado, renombrado y almacenado de forma controlada.

---


### Módulo 6 completado: Security Misconfiguration

**Categoría:** OWASP Top 10 - Security Misconfiguration  
**Estado:** completado en versión vulnerable y versión segura

**Descripción funcional**  
Se ha añadido un módulo orientado a mostrar errores de configuración y exposición innecesaria de información interna.  
Ambas versiones incluyen rutas relacionadas con configuración y errores, pero difieren en el nivel de información expuesta.

**Versión vulnerable**  
La versión vulnerable expone un endpoint de debug con información interna del proceso y un endpoint que muestra errores con stack trace completo.  
Esto facilita la obtención de detalles del entorno y de la estructura interna de la aplicación.

**Versión segura**  
La versión segura no expone endpoints de debug internos y utiliza un manejador de errores genérico que evita mostrar trazas internas al usuario.  
Además, se ejecuta en modo producción mediante `NODE_ENV=production`.

**Pruebas realizadas**  
Prueba 1:
- Acceso a `/debug-config` en la versión vulnerable.
- Se muestran detalles internos como `NODE_ENV`, puerto, directorio de trabajo, plataforma y PID.

Prueba 2:
- Acceso a `/debug-crash` en la versión vulnerable.
- Se muestra el stack trace completo del error.

Prueba 3:
- Acceso a `/safe-config` en la versión segura.
- No se exponen detalles internos de configuración.

Prueba 4:
- Acceso a `/safe-crash` en la versión segura.
- Se devuelve un mensaje genérico `Internal Server Error` sin stack trace visible.

---

### Módulo 7 completado: Broken Authentication

**Categoría:** OWASP Top 10 - Broken Authentication / Session Management  
**Estado:** completado en versión vulnerable y versión segura

**Descripción funcional**  
Se ha añadido un módulo de autenticación para comparar una gestión insegura del estado autenticado frente a una gestión basada en sesión servidor-side.

**Versión vulnerable**  
La versión vulnerable toma el estado autenticado directamente desde parámetros de URL (`user`, `role`, `auth`).  
Esto permite suplantar identidad y acceder al panel sin login real simplemente manipulando la URL.

**Versión segura**  
La versión segura utiliza `express-session` para mantener el estado autenticado en el servidor, almacenando únicamente el identificador de sesión en una cookie.  
Además, regenera la sesión tras el login y utiliza atributos de cookie como `HttpOnly` y `SameSite`.

**Pruebas realizadas**  
Prueba 1:
- Acceso directo a:

/auth-vul/panel?user=admin&role=admin&auth=1

En la version segura 
/auth-safe/panel?user=admin&role=admin&auth=1

---

### Módulo 8 completado: Sensitive Data Exposure / Cryptographic Failures

**Categoría:** OWASP Top 10 - Sensitive Data Exposure / Cryptographic Failures  
**Estado:** completado en versión vulnerable y versión segura

**Descripción funcional**  
Se ha añadido un módulo de perfil de usuario demo para mostrar el tratamiento inseguro y seguro de datos sensibles.

**Versión vulnerable**  
La versión vulnerable expone datos sensibles en claro, incluyendo contraseña, número de tarjeta completo, API key completa y notas internas.  
Además, utiliza una codificación débil (`base64`) para una contraseña de backup, lo que no aporta protección criptográfica real.

**Versión segura**  
La versión segura minimiza la exposición de datos sensibles, enmascara valores críticos y sustituye la contraseña en claro por un hash derivado mediante `scrypt`.  
También redacciona la información innecesaria que no debe mostrarse al cliente.

**Pruebas realizadas**  
Prueba 1:
- Acceso a `/sensitive-vul/profile` en la versión vulnerable.
- Se observan directamente:
  - `password` en claro
  - `backupPasswordB64`
  - `cardNumber` completo
  - `apiKey` completo
  - `personalNote` completa

Prueba 2:
- Acceso a `/sensitive-safe/profile` en la versión segura.
- Se observan:
  - `passwordHash` derivado con `scrypt`
  - `cardNumberMasked`
  - `apiKeyMasked`
  - `personalNote` redacted

---