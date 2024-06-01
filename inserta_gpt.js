const express = require('express');
const { connection, lastIdGpt , updateGpt } = require('./bd.js');
const consultaOpenAI = require( './usaapi_openai.js');

const util = require('util'); 
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    console.log('inserta_gpt');
    const { titulocons, consultxt } = req.body;
    const query = 'INSERT INTO egpt (consultxt, titulocons, fechahorareg) VALUES (?, ?, NOW())';
    const values = [ consultxt, titulocons ];
    
    const queryAsync = util.promisify(connection.query).bind(connection);    

    await queryAsync(query, values);

  /**llamada a funciones  'ultimoidgpt', 'consultaOpenAI' */
    const ultimoidqpt = await lastIdGpt();
    console.log('Ultimo idGPT:', ultimoidqpt);

    const respuesta = await consultaOpenAI(consultxt);

    updateGpt(ultimoidqpt, respuesta);
    
    console.log('Respuesta ChatGPT:', respuesta);
    res.json({ message: 'Resp', lastIdGpt: ultimoidqpt });
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});
module.exports = router;