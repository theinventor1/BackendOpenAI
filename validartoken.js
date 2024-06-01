const axios = require('axios');

async function validarToken(token) {
    try {
        const response = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`);
        console.log(response.data);
        // Aquí puedes manejar la respuesta como desees
    } catch (error) {
        console.error('Error al validar el token:', error.response.data);
        // Aquí puedes manejar el error como desees
    }
}

// Llama a la función validarToken con tu token como argumento
validarToken('ya29.a0Ad52N3_SAfM4LZ0pc4T2Kk5KPQxJaYkzgYmJ3eq2afD4PS1_gmkSYVEsTGcB37H8uVj3NQ6k-QjqR0tC8tzbh_zqKVJf2YNC2oFiTLF974X3JrBng7EQQdU9jUOpF-ohHk9vqmPqAdVIvTlncwfdiRQ2iwxOUKd805UwaCgYKASESARISFQHGX2MigNAgtqqBUD_tziFMvwaJxQ0171');