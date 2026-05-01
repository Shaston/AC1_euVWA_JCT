# AC1_euVWA_JCT
Damn Vulnerable Web Application (DVWA) a un entorno moderno basado en Node.js + Express, creando la aplicación euVWA


para iniciar la app en el directorio raiz npm start o node app.js
Ultimos cambios añadidos, tema de puertos y las pruebas en ramas sec y vul para no tener que arrancar y para el server
## En app.js const PORT = process.env.PORT || 3000;
Y luego ya por ej para los servidores PORT=3001 npm start en vul y PORT=3002 npm start en secure. 


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
Se ha añadido un nuevo módulo DOM XSS accesible desde la portada de la aplicación.  
Ambas versiones mantienen la misma funcionalidad: el usuario introduce texto en un campo y dicho contenido se refleja dinámicamente en el DOM al pulsar el botón 'Mostrar'.

**Versión vulnerable**  
La versión vulnerable inserta la entrada del usuario usando 'innerHTML'.  
Esto permite que el navegador interprete la entrada como HTML y ejecute código inyectado, provocando una vulnerabilidad de tipo DOM-based XSS.

**Versión segura**  
La versión segura inserta la entrada del usuario usando 'textContent'.  
De este modo, la entrada se trata como texto plano y no como HTML interpretable, evitando la ejecución del payload en este contexto.

**Pruebas realizadas**  
Payload de prueba 1:
<b>hola</b> entre otras 

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