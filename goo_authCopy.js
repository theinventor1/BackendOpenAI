const express = require('express');
const open = require('open');

const router = express.Router();
const port = 3002;
const clientId = "989415802534-u1v3o3bncpmnaoo50806j1f8lss3jg08.apps.googleusercontent.com";
const redirectUri = `https://localhost:${port}/callback`;

// Lanzar el navegador para iniciar el proceso de autenticación

router.get('/', (req, res) => {
 const scope = encodeURIComponent('https://www.googleapis.com/auth/userinfo.email');
 const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
 open(authUrl);
 res.send('Abriendo página de autenticación...');
});

module.exports = router;