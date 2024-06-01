const express = require('express');
const { connection } = require('./bd.js');

const util = require('util'); 
const axios = require ('axios');
const OpenAI = require('openai');
const router = express.Router();

const urlCloud = 'https://api.cloudinary.com/v1_1/dmjkjz1oa/image/upload';
/**este modulo debe hacer un axios a cloudinary */
const openai = new OpenAI({
 apiKey: process.env.OPENAI_API_KEY,
 organization: process.env.OPENAI_ORG 
});

router.post('/', async (req, res) => {
 try {
   console.log('inserta_imgxdesc');
   let { model,elprompt,n,imgsize } = req.body;
   model    = model     || 'dall-e-2';
   elprompt = elprompt  || 'Haz una ciudad de noche en cartoon que se vea en el horizonte como brillan sus edificios, con bordes en las ventanas acentuados.';
   n        = n ? parseInt(n) || 1 : 1;
   imgsize= imgsize || '512x512';
  
   console.log('req.body:', req.body);   
   let urlimagenmicrosoft = {}
   urlimagenmicrosoft = await urlImgResultado(model,elprompt,n,imgsize);
   console.log('urlMicrosoft:'  , urlimagenmicrosoft );

/**ahora debo mandar al cloudinary , obvio  */   

    const formDataForUpload = new FormData();
    formDataForUpload.append("file", urlimagenmicrosoft);
    formDataForUpload.append("upload_preset", "shoppie");

    const uploadResponse = await axios.post(urlCloud, formDataForUpload);
    const urlImagen = uploadResponse.data.secure_url;
    console.log('url cloudinary:' , urlImagen );

    const query = 'INSERT INTO imagenxdesc (model,prompt,n,imagesize,urlresultado, fechahorareg) VALUES (?,?,?,?,?,NOW())';
    const values = [model, elprompt, n, imgsize, urlImagen];
    const queryAsync = util.promisify(connection.query).bind(connection);    

    await queryAsync(query, values);
 
    res.json({ 
     message: 'Imagen procesada correctamente', url: urlImagen 
    });

  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;

const urlImgResultado = async (moDel, elPrompt, ene, imageSize) => {
 try {
   const response = await openai.images.generate({
     model:  moDel,
     prompt: elPrompt ,
     n:      ene,
     size:   imageSize
   });
// Accede al campo correcto donde se encuentra la URL
   return response.data[0].url; 
 } catch (error) { 
   console.error("Error al obtener la completitud:", error);
 }
};
