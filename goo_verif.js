const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/', async (req, res) => {

 const clientId  = process.env.CLIENTID;
  const { token } = req.body;
  try {
   console.log('algo pasa33:', token);
    const response = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`);
    console.log('token:',token);
    if (response.data.aud === clientId,'.apps.googleusercontent.com') {
// Asegúrate de que el aud (audience) coincide con tu Client ID
// Aquí puedes agregar lógica para verificar si el usuario ya está en la base de datos o no
// y proceder de acuerdo a tu lógica de negocio (crear sesión, token propio, etc.) 
      console.log('si entra a verificar');
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;