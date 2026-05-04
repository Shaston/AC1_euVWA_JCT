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

<img width="697" height="548" alt="image" src="https://github.com/user-attachments/assets/0bea9400-bf64-4f0b-855f-20644bbf1986" />




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

<img width="588" height="309" alt="image" src="https://github.com/user-attachments/assets/66d972ac-02b4-43cd-bd0e-bf8da2142b99" />
<img width="890" height="546" alt="image" src="https://github.com/user-attachments/assets/6fc40f8b-98d3-41ca-b3c7-83f87c4bdb77" />


Segura

Ambos payloads se muestran como texto.
No se ejecuta JavaScript.

<img width="564" height="314" alt="image" src="https://github.com/user-attachments/assets/62e609a2-7666-4141-8f59-91b3dde817f3" />
<img width="619" height="320" alt="image" src="https://github.com/user-attachments/assets/201ec9e9-42a8-4c7e-981c-5b0f56f17f22" />


---

6.2. Módulo 2 — Blind Command Injection

**Categoría:** OWASP Top 10 - Injection / OS Command Injection  
**Estado:** completado en versión vulnerable y versión segura

**Descripción funcional**  
Se ha añadido un nuevo módulo `Blind Command Injection` para demostrar una inyección ciega por tiempo.  
Ambas versiones mantienen la misma idea funcional: el usuario introduce un host y la aplicación devuelve una respuesta indicando el resultado de la operación.

**Versión vulnerable**  
La versión vulnerable construye un comando del sistema concatenando directamente la entrada del usuario.  
No muestra la salida del comando, pero sí el tiempo de respuesta, lo que permite demostrar una blind command injection mediante retardos artificiales.
La respuesta tarda aproximadamente 5 segundos.
No se muestra la salida del comando, pero el retraso confirma la inyección.
<img width="630" height="301" alt="image" src="https://github.com/user-attachments/assets/41847a41-1b2e-4dfb-93c0-5fb96dee4846" />


**Versión segura**  
La versión segura valida el valor recibido y evita por completo invocar comandos del sistema.  
En su lugar utiliza `dns.lookup()` como API nativa de Node.js para resolver el host.
El valor se rechaza como host inválido o no resoluble.
No hay retraso provocado por ejecución de shell.
<img width="573" height="237" alt="image" src="https://github.com/user-attachments/assets/1e38b125-97a9-43e0-99e5-e7d66557c4cc" />


**Prueba realizada**  
Payload de prueba:

127.0.0.1; sleep 5

---

6.3. Módulo 3 — Path Traversal / Arbitrary File Download

**Categoría:** OWASP Top 10 - File Inclusion / Path Traversal  

**Descripción funcional**   
Ambas versiones permiten solicitar un archivo para su descarga, pero difieren en la forma de validar el nombre y la ruta solicitada.
En la versión vulnerable se construye la ruta sin validación suficiente.
En la versión segura se utiliza allowlist y comprobación de ruta resuelta.

**Versión vulnerable**  
La versión vulnerable construye la ruta de descarga a partir de la entrada del usuario sin validación suficiente.  
Esto permite descargar archivos fuera del directorio previsto mediante secuencias de path traversal.
<img width="1096" height="419" alt="image" src="https://github.com/user-attachments/assets/575fb228-9e5b-4859-977b-9501c289e51f" />


**Versión segura**  
La versión segura limita los nombres permitidos mediante una allowlist y resuelve la ruta final con `path.resolve()`, comprobando que permanezca dentro del directorio autorizado antes de descargar el fichero.
<img width="783" height="238" alt="image" src="https://github.com/user-attachments/assets/ea16d6b7-737a-43c0-9f0c-beee86d0e561" />
Haciendo la misma prueba que en vulnerable y usando el fichero permitido.
<img width="976" height="472" alt="image" src="https://github.com/user-attachments/assets/c99509f3-0014-4d3c-ad50-371de5dc1239" />


**Pruebas realizadas**  
Payload de prueba 1:

../package.json

Payload 2 fichero permitido en versión segura:
fichero_public.txt

6.4. Módulo 4 — SQL Injection Login

**Categoría:** OWASP Top 10 - Injection / SQL Injection  

**Descripción funcional**  
Se ha añadido un módulo de autenticación simple basado en SQLite.  
Ambas versiones permiten iniciar sesión con un usuario de prueba (`admin / admin123`), pero difieren en la forma de construir la consulta SQL.
Se implementa un login basado en SQLite.
En la versión vulnerable la consulta SQL se construye por concatenación.
En la versión segura se usan consultas parametrizadas.

**Versión vulnerable**  
La versión vulnerable concatena directamente la entrada del usuario dentro de la sentencia SQL.  
Esto permite alterar la consulta y provocar un bypass de autenticación mediante SQL Injection.
El login se realiza con el payload de inyección.
<img width="751" height="349" alt="image" src="https://github.com/user-attachments/assets/5d5c1986-1208-4f86-a6bf-4b93ebe39170" />


**Versión segura**  
La versión segura utiliza consultas parametrizadas (`?`) con binding de valores, separando claramente la lógica SQL de los datos suministrados por el usuario.  
Además, aplica una validación básica de entrada.
El payload falla como credenciales inválidas.
<img width="659" height="289" alt="image" src="https://github.com/user-attachments/assets/fe8271b9-c09c-4b42-974e-0b587b5352a9" />
El login legítimo funciona.
<img width="649" height="321" alt="image" src="https://github.com/user-attachments/assets/da744ffc-95ed-4872-812f-04a6a8a02284" />


**Pruebas realizadas**  
Prueba legítima:

admin/admin123

Prueba owasp

' OR '1'='1' -- / loquesea

---

6.5. Módulo 5 — Insecure File Upload

**Categoría:** OWASP Top 10 - Insecure File Upload  

**Descripción**  
Ambas versiones permiten subir un archivo, pero difieren en las validaciones aplicadas y en la forma de almacenarlo/publicarlo.
En la versión vulnerable se aceptan archivos sin restricciones suficientes y se exponen en una ruta pública.
En la versión segura solo se permiten .txt, se renombran y no se publican directamente.

**Versión vulnerable**  
La versión vulnerable acepta archivos sin restricciones suficientes, conserva el nombre original y los deja accesibles desde una ruta pública servida por la aplicación.  
Esto permite subir contenido activo, como un archivo HTML con JavaScript embebido, y ejecutarlo posteriormente desde el navegador.
prueba.html se sube.
El archivo queda accesible en /uploads/prueba.html.
<img width="663" height="336" alt="image" src="https://github.com/user-attachments/assets/c73a742d-1310-4257-93c3-3797485c84fe" />

Al abrirlo, se ejecuta el alert.
<img width="1021" height="620" alt="image" src="https://github.com/user-attachments/assets/58775c73-c1d4-4c33-a535-f00557ca64a0" />


**Versión segura**  
La versión segura solo permite archivos `.txt`, aplica límite de tamaño, renombra el archivo antes de almacenarlo y no lo expone mediante una ruta pública directa.
prueba.html es rechazado.
<img width="751" height="283" alt="image" src="https://github.com/user-attachments/assets/36881869-ffdb-4206-9966-8b39f7e40180" />

nota.txt es aceptado, renombrado y almacenado de forma controlada.
<img width="782" height="370" alt="image" src="https://github.com/user-attachments/assets/3a1949f9-5472-4cba-aa78-3eee2ec9f91f" />


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


6.6. Módulo 6 — Security Misconfiguration

**Categoría:** OWASP Top 10 - Security Misconfiguration  

**Descripción**  
Muestra errores de configuración y exposición innecesaria de información interna.  
Ambas versiones incluyen rutas relacionadas con configuración y errores, pero difieren en el nivel de información expuesta.
Ruta vulnerable: /debug-config, /debug-crash
Ruta segura: /safe-config, /safe-crash
Se implementan rutas relacionadas con depuración y errores.

En la versión vulnerable se expone configuración interna y stack trace.
En la versión segura se ocultan detalles internos y se responde con error genérico.

**Versión vulnerable**  
La versión vulnerable expone un endpoint de debug con información interna del proceso y un endpoint que muestra errores con stack trace completo.  
Esto facilita la obtención de detalles del entorno y de la estructura interna de la aplicación.

<img width="781" height="419" alt="image" src="https://github.com/user-attachments/assets/e4bd26a3-e5b1-4df1-afe6-c29509152569" />
Se exponen variables internas y stack trace completo.
<img width="786" height="284" alt="image" src="https://github.com/user-attachments/assets/255be2c6-a3b0-4033-9afb-cb665c7edc82" />


**Versión segura**  
La versión segura no expone endpoints de debug internos y utiliza un manejador de errores genérico que evita mostrar trazas internas al usuario.  
Además, se ejecuta en modo producción mediante `NODE_ENV=production`.

No se exponen detalles internos.
<img width="793" height="295" alt="image" src="https://github.com/user-attachments/assets/37f00018-51ba-4a47-b0fb-1e3b58191ad7" />

Se devuelve un error genérico.
<img width="838" height="310" alt="image" src="https://github.com/user-attachments/assets/1fbf753b-45ca-423b-83ae-16d766a7d427" />


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

6.7. Módulo 7 — Broken Authentication / Session Management

**Categoría:** OWASP Top 10 - Broken Authentication / Session Management  
Ruta vulnerable: /auth-vul/login, /auth-vul/panel
Ruta segura: /auth-safe/login, /auth-safe/panel

**Descripción**  
comparar una gestión insegura del estado autenticado frente a una gestión basada en sesión servidor-side.
Se compara una autenticación rota basada en parámetros de URL frente a una autenticación basada en sesión servidor-side.

En la versión vulnerable el estado autenticado depende de parámetros manipulables.
En la versión segura el estado depende de express-session.

**Versión vulnerable**  
La versión vulnerable toma el estado autenticado directamente desde parámetros de URL (`user`, `role`, `auth`).  
Esto permite suplantar identidad y acceder al panel sin login real simplemente manipulando la URL.
El panel concede acceso sin login real.
<img width="784" height="306" alt="image" src="https://github.com/user-attachments/assets/6aa61de3-524d-4cba-b5c7-749b55def708" />


**Versión segura**  
La versión segura utiliza `express-session` para mantener el estado autenticado en el servidor, almacenando únicamente el identificador de sesión en una cookie.  
Además, regenera la sesión tras el login y utiliza atributos de cookie como `HttpOnly` y `SameSite`.
El panel no concede acceso usando parámetros en URL.
<img width="806" height="312" alt="image" src="https://github.com/user-attachments/assets/ca30aa82-d057-489b-81f9-fb0022a413de" />
El equivalente en este caso es ponerlo en la url "/auth-safe/panel?user=admin&role=admin&auth=1"

El acceso solo se concede mediante login válido y sesión activa.
<img width="757" height="294" alt="image" src="https://github.com/user-attachments/assets/fc9b381b-7fcf-4c34-a724-b57304bc804f" />


**Pruebas realizadas**  
Prueba 1:
- Acceso directo a:

/auth-vul/panel?user=admin&role=admin&auth=1

En la version segura 
/auth-safe/panel?user=admin&role=admin&auth=1

---

6.8. Módulo 8 — Sensitive Data Exposure / Cryptographic Failures

**Categoría:** OWASP Top 10 - Sensitive Data Exposure / Cryptographic Failures  
Ruta vulnerable: /sensitive-vul/profile
Ruta segura: /sensitive-safe/profile

**Descripción funcional**  
módulo de perfil de usuario demo para mostrar el tratamiento inseguro y seguro de datos sensibles.
Se implementa una ficha de usuario demo para comparar exposición insegura y tratamiento más seguro de datos sensibles.

En la versión vulnerable se exponen datos sensibles en claro.
En la versión segura se minimizan datos, se enmascaran secretos y la contraseña se representa mediante hash derivado con scrypt.

**Versión vulnerable**  
La versión vulnerable expone datos sensibles en claro, incluyendo contraseña, número de tarjeta completo, API key completa y notas internas.  
Además, utiliza una codificación débil (`base64`) para una contraseña de backup, lo que no aporta protección criptográfica real.
Se muestran directamente contraseña, tarjeta completa, API key y nota completa.
<img width="824" height="441" alt="image" src="https://github.com/user-attachments/assets/f6fc9d5d-83d3-4010-a5d9-4bb4b20df817" />


**Versión segura**  
La versión segura minimiza la exposición de datos sensibles, enmascara valores críticos y sustituye la contraseña en claro por un hash derivado mediante `scrypt`.  
También redacciona la información innecesaria que no debe mostrarse al cliente.
Se muestra passwordHash derivado con scrypt, tarjeta aparece enmascarada, API key truncada y la nota aparece redactada.
<img width="1175" height="372" alt="image" src="https://github.com/user-attachments/assets/6254cf63-ccd6-4564-9be6-bd1098d3f2c1" />


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
7. Estructura del proyecto

controllers/
routes/
services/
public/
files/
data/
app.js
package.json

La estructura separa controladores, rutas, servicios y recursos auxiliares para mantener el proyecto organizado y la comparación entre las dos ramas principales.

---
8. Ramas/branchs

La rama main-vulnerable contiene las implementaciones explotables.
La rama main-secure contiene las correcciones equivalentes.
La rama main se utiliza como documentación principal del proyecto.
La aplicación ha sido probada en local utilizando puertos separados para facilitar la comparación.

---

9. docker opcional
Probar la aplicación sin instalar dependencias Node.js directamente en el sistema anfitrión.

imagen oficial de Node basada en Debian (node:22-bookworm-slim) para mejorar la compatibilidad con dependencias nativas como sqlite3 y facilitar la ejecución tanto en equipos amd64 como en equipos Apple Silicon arm64.

10. docker uso
En las ramas de main vulnerable y main secure estan los ficheros Dockerfile y .dockerignore con los que podras montar el propio docker.. los comando a lanzar serian los siguientes.

Importante para abrirlo correctamente, aunque el enlace mande al puerto 3000, hay que poner el 3001 o 3002
- Nota: dentro del contenedor la aplicación escucha en el puerto `3000`.
- Docker publica ese puerto en el host usando `-p`.
- Por eso, con `-p 3001:3000`, la versión vulnerable se abre desde el navegador en `http://localhost:3001`.

Para vulnerable (si hay fallo o problema, usar sudo para hacer el docker build en caso de linux):
docker build -t euvwa-vulnerable .

docker run --rm -p 3001:3000 -e PORT=3000 euvwa-vulnerable

Para secure (si hay fallo o problema, usar sudo para hacer el docker build en caso de linux):
docker build -t euvwa-secure .

docker run --rm -p 3002:3000 -e PORT=3000 -e NODE_ENV=production -e SESSION_SECRET=lab-secret-demo euvwa-secure

Probando docker con el 2º lab, anteriormente ya probé el vulnerable.

<img width="1057" height="915" alt="image" src="https://github.com/user-attachments/assets/54ca46f0-7a4b-43de-9117-f36d9786241a" />

