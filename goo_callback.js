const express = require('express');
const { getAccessTokenFromCode }   = require('./bd.js');
const router = express.Router();

router.get('/', async (req, res) => {
 console.log('goo_callback');
 const code = req.query.code;
 if (!code) {
     return res.status(400).send('No se encontró el código de autorización.');
 }
 try {
     const token = await getAccessTokenFromCode(code);
     res.send(`Token de acceso: ${token.access_token}`);
     console.log ('access token:',token.access_token)
 } catch (error) {
     res.status(500).send('Error al obtener el token de acceso.');
 }
}); 
module.exports = router;