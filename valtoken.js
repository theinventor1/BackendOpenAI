const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.CLIENTID);

async function validarToken(token) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENTID,  // Coloca aquí tu CLIENT_ID
        });
        const payload = ticket.getPayload();
        console.log(payload);
        // Aquí puedes manejar el payload como desees
    } catch (error) {
        console.error('Error al validar el token:', error.message);
        // Aquí puedes manejar el error como desees
    }
}

module.exports = validarToken;