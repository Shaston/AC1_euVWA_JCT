# AC1_euVWA_JCT y AC2
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

--
**PARTE AC2
**
**Pipeline SecDevOps
**
Incorporar un flujo SecDevOps mediante GitHub Actions, automatizando controles de seguridad sobre el código, dependencias, SBOM, aplicación en ejecución e imagen Docker.

**El pipeline se ha aplicado sobre dos ramas principales:
**
  -main-vulnerable: versión vulnerable de la aplicación. El pipeline debe detectar riesgo alto y finalizar en estado failed.
  -main-secure: versión securizada de la aplicación. El pipeline debe superar los controles configurados y finalizar en estado passed.

  <img width="579" height="150" alt="image" src="https://github.com/user-attachments/assets/f70d48a9-e277-4591-ad2b-0eee20e51b09" />


**1. Objetivo del pipeline
**
El pipeline implementado integra controles de seguridad dentro del ciclo de integración continua. De esta forma, cada cambio subido al repositorio ejecuta automáticamente una serie de validaciones técnicas antes de considerar la versión como aceptable.

**Los objetivos principales son:
**
validar que el proyecto puede instalar dependencias y arrancar correctamente.
construir una imagen Docker reproducible.
ejecutar análisis estático de código fuente mediante SAST.
generar un SBOM en formato CycloneDX.
analizar vulnerabilidades en dependencias, SBOM e imagen Docker.
ejecutar análisis dinámico DAST contra la aplicación levantada en CI.
generar informes descargables como artefactos del workflow.
aplicar un security gate que bloquee la rama vulnerable cuando existan alertas de riesgo alto.
publicar la imagen Docker de la versión segura en GitHub Container Registry.

2. Estructura del workflow

El workflow principal se encuentra en: 
.github/workflows/secdevops.yml

El pipeline se ejecuta en las ramas:
-main-vulnerable
-main-secure

También puede ejecutarse manualmente mediante workflow_dispatch desde la pestaña Actions del repositorio.

El workflow utiliza un runner Linux de GitHub Actions y organiza todo el proceso dentro de un job principal denominado Baseline build and validation.

<img width="653" height="718" alt="image" src="https://github.com/user-attachments/assets/dd44360e-23aa-478f-8947-edd859abe8de" />

3. Fases del pipeline y propósito de seguridad

check del repositorio, la primera fase descarga el contenido de la rama que ha lanzado el workflow
- name: Checkout repository
  uses: actions/checkout@v6

Propósito de seguridad:
Permite analizar exactamente el código que se ha subido a la rama correspondiente. Esto garantiza trazabilidad entre commit, rama, informes generados y resultado final del pipeline.

Preparación de Node.js

Prepara el entorno de ejecución Node.js usado por el pipeline.
- name: Setup Node.js
  uses: actions/setup-node@v6
  with:
    node-version: "24"
    cache: "npm"

Propósito de seguridad:
El uso de una versión concreta de Node.js hace que la ejecución sea reproducible. Usar acciones actualizadas evita advertencias deprecadas del runtime de GitHub Actions y reduce problemas por versiones antiguas del entorno de CI.

<img width="833" height="298" alt="image" src="https://github.com/user-attachments/assets/b4a76fe4-1477-40c9-812f-eb695c107a4c" />

Instalación de dependencias

El pipeline instala las dependencias declaradas en package-lock.json mediante:
npm ci

Propósito de seguridad:

npm ci instala las dependencias a partir del lockfile. Esto evita instalaciones variables entre entornos y permite que los análisis posteriores se ejecuten sobre el árbol real de dependencias del proyecto.


Análisis SAST con Semgrep

Se ejecuta Semgrep como herramienta de análisis estático de código fuente.
El análisis se realiza sobre el repositorio completo y genera informes en formato JSON y texto:

-reports/semgrep-report.json
-reports/semgrep-report.txt
-reports/semgrep-summary.md

Propósito de seguridad:

SAST permite detectar patrones inseguros sin ejecutar la aplicación. En este caso se utiliza para revisar código JavaScript, Dockerfile, YAML del workflow y otros ficheros del repositorio.


Entre los tipos de hallazgos que puede detectar se incluyen:

concatenación insegura de comandos.
-patrones de inyección.
-uso inseguro de entrada de usuario.
-configuraciones débiles.
-problemas en Dockerfile.
-posibles malas prácticas en workflows CI/CD.

El pipeline genera informes de Semgrep en ambas ramas. En mi caso, Semgrep se utiliza como control informativo/reporting y no como bloqueo principal. El bloqueo se aplica posteriormente mediante el security gate basado en DAST. Las priemras versiones fueron de aviso y las finales ya fueron de bloqueo.

<img width="685" height="677" alt="image" src="https://github.com/user-attachments/assets/63ce45d1-22c4-4c4b-a5db-e3df7f367968" />

Escaneo de dependencias y filesystem con Trivy

Trivy analiza el repositorio y las dependencias instaladas mediante un escaneo de filesystem.

Generando los siguientes artefactos:


reports/trivy-fs-report.json
reports/trivy-summary.md

Este control permite identificar vulnerabilidades conocidas en librerías, paquetes y componentes utilizados por la aplicación. A diferencia del SAST, que revisa patrones de código, Trivy revisa componentes y versiones para detectar CVEs conocidas.

El informe de Trivy queda disponible como artefacto del pipeline. En esta práctica se utiliza como evidencia de análisis de dependencias y como fuente de propuestas de mejora, pero no como bloqueo principal del pipeline.

<img width="866" height="620" alt="image" src="https://github.com/user-attachments/assets/9e04fc27-8719-4ad2-a336-62b6cc8a2d35" />

<img width="524" height="760" alt="image" src="https://github.com/user-attachments/assets/aa896ce2-ab7e-4982-8be9-8d5203cfedbf" />


Generación de SBOM CycloneDX

El pipeline genera un SBOM en formato CycloneDX usando Trivy.

Generando el artefacto:
reports/sbom-cyclonedx.json

El SBOM funciona como inventario de componentes software del proyecto. Permite conocer qué librerías, versiones y dependencias forman parte de la aplicación, facilita auditorías, trazabilidad y análisis posteriores ante vulnerabilidades nuevas.

El fichero sbom-cyclonedx.json queda incluido en los artefactos descargables del workflow.

<img width="309" height="96" alt="image" src="https://github.com/user-attachments/assets/19add6de-c63e-4bd5-aad1-ddaa288a8214" />


<img width="612" height="938" alt="image" src="https://github.com/user-attachments/assets/6285cd9b-995b-44eb-b90f-8727f9a4592d" />


Análisis del SBOM con Trivy

Después de generar el SBOM, el pipeline lo analiza también con Trivy.

Genera el artefacto:
reports/trivy-sbom-report.json
<img width="511" height="28" alt="image" src="https://github.com/user-attachments/assets/6d853f36-f299-4c48-ba57-c9064f461149" />

El SBOM no solo se genera como inventario, sino que también puede utilizarse como entrada para análisis de vulnerabilidades. Esto permite separar la fase de inventariado de la fase de evaluación de riesgos.


Generación de metadatos del pipeline

El pipeline genera un pequeño informe base con información del contexto de ejecución:
reports/baseline-report.md
<img width="510" height="36" alt="image" src="https://github.com/user-attachments/assets/2e3f8cbe-5f46-4d27-8a65-61c722460938" />

Incluye datos como:

-rama ejecutada.
-commit analizado.
-versión de Node.js.
-versión de npm.
-fecha de ejecución.

<img width="448" height="202" alt="image" src="https://github.com/user-attachments/assets/f8822c48-90fc-41af-b5b1-e0a552ead428" />

Permite asociar los resultados de SAST, DAST, Trivy y SBOM a una rama y commit concretos.



Validación de arranque de la aplicación

Antes de construir la imagen y lanzar DAST, el pipeline comprueba que la aplicación puede arrancar correctamente, la aplicación Express queda escuchando de forma persistente, por lo que el workflow utiliza un timeout controlado para considerar correcto el arranque si el proceso permanece y evita lanzar análisis dinámicos o construir imágenes sobre una aplicación rota. Si la aplicación no puede arrancar, el pipeline debe detectarlo pronto.

Construcción de imagen Docker

El pipeline construye una imagen Docker local:
docker build -t euvwa:ci .

valida que el proyecto puede empaquetarse de forma reproducible en un contenedor. La imagen resultante se utiliza después para:

-ejecutar la aplicación durante el DAST.
-escanear vulnerabilidades de imagen.
-publicar la imagen segura en GHCR cuando el pipeline pasa los controles.

<img width="769" height="759" alt="image" src="https://github.com/user-attachments/assets/3bf4c071-a720-4861-a410-53851d0e5c49" />


Endurecimiento aplicado en Dockerfile

El Dockerfile se ha ajustado para mejorar la seguridad de la imagen.

-uso de imagen base oficial node:22-bookworm-slim.
-instalación solo de dependencias necesarias para compilar módulos nativos.
-eliminación de caché de apt para reducir residuos en la imagen.
-instalación reproducible mediante npm ci --omit=dev.
-eliminación de node_modules previo para evitar copiar dependencias del host.
-creación de usuario específico appuser.
-cambio de propiedad de /app a appuser.
-ejecución final de la aplicación como usuario no privilegiado mediante USER appuser.
-exposición únicamente del puerto necesario 3000.
-ausencia de secretos embebidos en la imagen.

Medidas que reducen la superficie de ataque del contenedor y evitan que la aplicación se ejecute como root. Si la aplicación sufriera una explotación, el atacante quedaría limitado por los permisos del usuario no privilegiado dentro del contenedor.

<img width="819" height="631" alt="image" src="https://github.com/user-attachments/assets/9124203d-4121-4d58-b23e-c6968c03e989" />

Aplicación para DAST

Para realizar el análisis dinámico, el pipeline crea una red Docker temporal:
secdevops-net

Después levanta la aplicación en un contenedor llamado:
euvwa-dast

La aplicación se expone internamente como:
http://euvwa-dast:3000

El DAST necesita analizar la aplicación en ejecución. Al levantarla dentro del workflow, el pipeline prueba la aplicación de forma automatizada y sin intervención manual.

Usar una red Docker dedicada evita depender de configuraciones externas y permite que OWASP ZAP acceda al contenedor por nombre de servicio.


Análisis DAST con OWASP ZAP Baseline

El pipeline ejecuta OWASP ZAP en modo baseline contra la aplicación levantada en Docker.

Genera los siguientes artefactos:

-reports/zap/zap-report.json
-reports/zap/zap-report.html
-reports/zap/zap-report.md
-reports/zap/zap.yaml
-reports/zap-summary.md

<img width="514" height="131" alt="image" src="https://github.com/user-attachments/assets/5f5394bc-8bdc-463b-b602-98ae74a3d7a7" />

<img width="587" height="55" alt="image" src="https://github.com/user-attachments/assets/4e55ee0d-2069-4452-be92-04bfa3f15e8f" />

DAST analiza la aplicación desde fuera, simulando la perspectiva de un cliente o atacante. SAST, no revisa el código fuente directamente, sino el comportamiento real de la aplicación en ejecución.

Se utiliza ZAP Baseline porque permite realizar un análisis pasivo y "rápido" para integración continua.
<img width="488" height="736" alt="image" src="https://github.com/user-attachments/assets/9b42c3fc-aa37-4a40-83d5-ef85619debdb" />


Resultado en la rama vulnerable
En main-vulnerable, ZAP detecta una alerta de riesgo alto:

High - PII Disclosure
URL: /sensitive-vul/profile
Evidencia: 4111111111111111

<img width="1247" height="399" alt="image" src="https://github.com/user-attachments/assets/327605d6-bb2f-4878-a469-a2021d877da8" />


Esta alerta se corresponde con el módulo vulnerable de exposición de datos sensibles.

<img width="1231" height="804" alt="image" src="https://github.com/user-attachments/assets/0e1aab11-29a6-4d19-be72-25b6bdb9e049" />


Resultado en la rama segura:

En main-secure, ZAP no detecta alertas de riesgo alto. El informe puede seguir mostrando alertas medias o bajas relacionadas con cabeceras HTTP de hardening, pero el riesgo alto presente en la rama vulnerable desaparece.

<img width="450" height="270" alt="image" src="https://github.com/user-attachments/assets/703ed77a-9755-4b16-9d8d-28793a81918f" />



Escaneo de imagen Docker con Trivy

la imagen euvwa:ci, Trivy analiza la imagen Docker.
reports/trivy-image-report.json

Identifica vulnerabilidades conocidas en la imagen final del contenedor, incluyendo paquetes del sistema base y librerías instaladas. Es una validación importante porque una aplicación puede tener código seguro pero ejecutarse sobre una imagen con componentes vulnerables.

El escaneo de imagen se mantiene como control informativo/reporting, mientras que el bloqueo principal del pipeline se realiza mediante el security gate basado en alertas High de ZAP.


Security Gate

El pipeline incluye un security gate propio basado en el informe JSON de OWASP ZAP, aplicando el siguiente criterio.
El pipeline falla si OWASP ZAP detecta cualquier alerta de riesgo High y genera el reporte reports/security-gate-report.md

Por ejemplo en este caso, es del vulnerable.
<img width="978" height="303" alt="image" src="https://github.com/user-attachments/assets/249d4308-024b-41b4-8f87-0030d87ceab2" />

El security gate transforma el pipeline de un sistema meramente informativo a un sistema de control. Si se detecta una vulnerabilidad de alto riesgo en la aplicación en ejecución, el pipeline se bloquea.

<img width="803" height="389" alt="image" src="https://github.com/user-attachments/assets/10fc6955-b7e9-4bd4-8ec7-d026b15bd393" />

La rama vulnerable falla porque ZAP detecta exposición de datos sensibles.

La rama segura pasa porque no presenta alertas High en el DAST.

<img width="526" height="237" alt="image" src="https://github.com/user-attachments/assets/74134414-c3a3-488a-a2c8-b8cf8172b212" />

<img width="466" height="131" alt="image" src="https://github.com/user-attachments/assets/a39ce0d2-b18c-4a53-ab49-949e92b33198" />

Publicación Docker en GHCR

La imagen Docker de la rama segura se publica en GitHub Container Registry cuando se cumplen estas condiciones:

-la rama ejecutada es main-secure.
-el security gate no ha fallado.
-la imagen Docker se ha construido correctamente.

reports/published-image.md

Imagen publicada:
ghcr.io/shaston/ac1_euvwa_jct:secure-latest
ghcr.io/shaston/ac1_euvwa_jct:secure-<commit>

Solo se publica la imagen correspondiente a la rama segura. La versión vulnerable queda bloqueada por el security gate y no llega a publicarse, evitando distribuir una imagen con vulnerabilidades críticas o altas detectadas dinámicamente.

<img width="356" height="139" alt="image" src="https://github.com/user-attachments/assets/d3a2e74a-7139-4ef1-a3dc-eb5c67ae9be5" />

<img width="471" height="157" alt="image" src="https://github.com/user-attachments/assets/020aa00e-4f08-4ad5-b909-4220deb099f4" />

Subida de artefactos

Todos los informes generados se suben como artefacto del workflow.

secdevops-reports-main-vulnerable
secdevops-reports-main-secure

Generando los siguientes informes o artefactos:

baseline-report.md
semgrep-report.json
semgrep-report.txt
semgrep-summary.md
sbom-cyclonedx.json
trivy-fs-report.json
trivy-sbom-report.json
trivy-image-report.json
trivy-summary.md
zap/zap-report.html
zap/zap-report.json
zap/zap-report.md
zap/zap.yaml
zap-summary.md
security-gate-report.md
published-image.md

Los artefactos permiten revisar evidencias técnicas después de cada ejecución, incluso si el pipeline falla. Esto es importante en la rama vulnerable, donde el pipeline termina en rojo pero conserva los informes necesarios para justificar el motivo del bloqueo.

<img width="764" height="196" alt="image" src="https://github.com/user-attachments/assets/638c36f2-3393-4486-bbbf-1bf93c3740c8" />


<img width="177" height="369" alt="image" src="https://github.com/user-attachments/assets/ce935ddf-a633-4561-9c1a-2641df240e77" />


Sobre algunas mejoras de seguridad, podrian ser...

Endurecimiento de cabeceras http

definir Content Security Policy.
añadir X-Frame-Options o equivalente mediante CSP frame-ancestors.
eliminar o controlar la cabecera X-Powered-By.

Gate adicional con Trivy
actualizar imagen base Node cuando existan parches disponibles.

Gate adicional con Semgrep
activar bloqueo para findings críticos o de alta confianza.



