const express = require('express');
const { connection }= require('./bd.js');

const util = require('util'); 
const axios = require ('axios');
const router = express.Router();

router.post('/', async (req, res) => {
 try {
   console.log('inserta_iaimagen');
   let { model,systemtype1,usertype1,usertype2,texto1,texto2,intoken,urlimagen } = req.body;

   model = model || 'gpt-4-1106-vision-preview';
   systemtype1 = systemtype1 || 'text';
   usertype1   = usertype1   || 'text';
   usertype2   = usertype2   || 'image_url';

   texto1 = texto1 || 'Eres genial analizando imágenes.';
   texto2 = texto2 || 'Qué ves en esta imagen? Sé breve.';
   intoken = intoken ? parseInt(intoken) || 60 : 60;
   urlimagen = urlimagen || 'https://trazanet.duckdns.org/png/imagenes4.png';
   console.log('req.body:', req.body);
/**ANTES DE INSERTAR, debo ir a buscar la descripcion a la AI */
   let descimagen = await analizarImagen(model,systemtype1,usertype1,usertype2,urlimagen,texto1,texto2);
   console.log('AI: ', descimagen);
   const query = 'INSERT INTO iaimagen (model,systemtype1,usertype1,usertype2,texto1,texto2,intoken,urlimagen,descimagen,fechahorareg) VALUES (?,?,?,?,?,?,?,?,?,NOW())';
   const values = [model, systemtype1, usertype1, usertype2, texto1, texto2, intoken, urlimagen, descimagen];
   const queryAsync = util.promisify(connection.query).bind(connection);    
   const result = await queryAsync(query, values); 
   res.json({ message: 'Respuesta:' , result  });
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

async function analizarImagen(model, systemtype1, usertype1, usertype2, laurl, texto1, texto2) {
 try {
   const openaiurl = 'https://api.openai.com/v1/chat/completions'; 
   const token = process.env.TOKEN_OPENAI;   
   const requestBody = {
     "model": model,
     "messages": [
       {
         "role": "system",
         "content": [
           {
             "type": systemtype1,
             "text": texto1 
           }
         ]
       },
       {
         "role": "user",
         "content": [
           {
             "type": usertype1,
             "text": texto2 
           },
           {
             "type": usertype2,
             "image_url": {
             "url": laurl
             }
           }
         ]
       }
     ],
     "max_tokens": 190
   };   
   const config = {
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${token}`
     }
   };   
   const response = await axios.post(openaiurl, requestBody, config);
   console.log('message objeto: ', response.data.choices[0].message);
   return response.data.choices[0].message.content;
 } catch (error) {
   console.error('Error al hacer la solicitud:', error);
 }
}

module.exports = router;

