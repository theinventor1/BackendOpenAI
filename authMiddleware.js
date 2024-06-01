const axios = require('axios');
require("dotenv").config();

const validarToken = async (req, res, next) => {
   const clienteid= process.env.CLIENTID;

   const accessToken = req.headers.authorization?.split(" ")[1];  // Extraer el token de acceso de los headers de la solicitud
   console.log('si entra a validar',accessToken);
    if (!accessToken) {
        return res.status(401).json({ error: 'Acceso denegado, token no proporcionado' });
    }
    try {
        // Usando la función de validación que ya tienes, suponiendo que devuelve true si el token es válido
        const response = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`);
        if (response.data.aud === clienteid) { 
         console.log('valido')
         // Verificar si el token es para nuestra app
            next();  // Si el token es válido, proceder con la solicitud
        } else {
            console.log('invalido!!!!')
            return res.status(401).json({ error: 'Token inválido' });
        }
    } catch (error) {
        return res.status(400).json({ error: 'Error al validar el token' });
    }
};
module.exports = validarToken;