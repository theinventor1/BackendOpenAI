const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs'); 
const path = require('path');
// Rutas de tus módulos
const inserta_iaimagen = require('./inserta_iaimagen.js');
const inserta_gpt = require('./inserta_gpt.js');
const update_gpt = require('./update_gpt.js');
const cargar_gpt = require('./cargar_gpt.js');
const inserta_imgxdesc = require('./inserta_imgxdesc.js');
const cargar_iaimagenes = require('./cargar_iaimagenes.js');
const cargar_descimagenes = require('./cargar_descximgs.js');
const app = express();
// Configuración de CORS para permitir todas las solicitudes
app.use(cors({
    origin: '*', // Permite todas las orígenes
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'] // Encabezados permitidos
}));
// Middleware para parsear JSON
app.use(express.json());

// Definición de rutas
app.use('/insertimg', inserta_iaimagen);
app.use('/creaimgxdesc', inserta_imgxdesc);
app.use('/insertar', inserta_gpt);
app.use('/update', update_gpt);
app.use('/allgpt', cargar_gpt);
app.use('/allimagenes', cargar_iaimagenes);
app.use('/alldesc', cargar_descimagenes);

app.get("/", (req, res) => {
    res.send('¡API Open AI!');
});

// Configuración de certificados SSL
const certificados = {
 key: fs.readFileSync(path.resolve('/llavesletsencrypt/privkey.pem'), 'utf8'),
 cert: fs.readFileSync(path.resolve('/llavesletsencrypt/fullchain.pem'), 'utf8')
};

const PORT = process.env.PORT || 3002;

https.createServer(certificados, app).listen(PORT, () => {
    console.log(`Servidor HTTPS iniciado en el puertoA ${PORT}`);
}).on('error', (error) => {
    console.error(`ERROR al iniciar Express HTTPSs. Revisa .env y config del PORT: ${error.message}`);
});
