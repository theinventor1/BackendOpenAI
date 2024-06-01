const express = require('express');
const router = express.Router();

const clientId    = process.env.CLIENTID;
const redirectUri = process.env.REDIRECTURI;

// Endpoint que inicia el proceso de autenticación
router.get('/', (req, res) => {
  console.log('goo_auth');
  const scope = encodeURIComponent('https://www.googleapis.com/auth/userinfo.email');
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
  
  import('open').then(open => {
   open.default(authUrl) // Nota que se usa open.default debido a la naturaleza de la importación ESM
   .then(() => {
     res.send('Abriendo página de autenticación...');
   })
   .catch(err => {
     console.error('Error al abrir la URL:', err);
     res.status(500).send('No se pudo abrir la página de autenticación');
   });
    });
});

module.exports = router;