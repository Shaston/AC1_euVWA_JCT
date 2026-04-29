# AC1_euVWA_JCT
Damn Vulnerable Web Application (DVWA) a un entorno moderno basado en Node.js + Express, creando la aplicación euVWA


para iniciar la app en el directorio raiz npm start o node app.js


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

## Estrategia de trabajo

 main-vulnerable: versión vulnerable de la aplicación
 main-secure: versión securizada equivalente
Se trabajará vulnerabilidad por vulnerabilidad, implementando cada pareja:
 versión vulnerable
 versión secure

 ### Módulo 1 completado: DOM-based XSS

**Categoría:** OWASP Top 10 - Injection / XSS  
**Estado:** completado en versión vulnerable y versión segura

**Descripción funcional**  
Se ha añadido un nuevo módulo `DOM XSS` accesible desde la portada de la aplicación.  
Ambas versiones mantienen la misma funcionalidad: el usuario introduce texto en un campo y dicho contenido se refleja dinámicamente en el DOM al pulsar el botón `Mostrar`.

**Versión vulnerable**  
La versión vulnerable inserta la entrada del usuario usando `innerHTML`.  
Esto permite que el navegador interprete la entrada como HTML y ejecute código inyectado, provocando una vulnerabilidad de tipo DOM-based XSS.

**Versión segura**  
La versión segura inserta la entrada del usuario usando `textContent`.  
De este modo, la entrada se trata como texto plano y no como HTML interpretable, evitando la ejecución del payload en este contexto.

**Pruebas realizadas**  
Payload de prueba 1:
```html
<b>hola</b>