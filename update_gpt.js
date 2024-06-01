const express = require('express');
const connection = require('./bd.js');

const validator = require('validator');

const router = express.Router();
router.put('/', (req, res) => {
  const { idegpt, resptxt } = req.body;
  console.log('resptxt:', resptxt);
  if (typeof resptxt !== 'string' || typeof idegpt !== 'number') {
    res.status(400).json({ error: 'Datos de entrada inválidos' });
    return;
  }
  const cleanText = validator.escape(resptxt);
  const query = "UPDATE egpt SET resptxt = ? WHERE idegpt = ?";  
  connection.execute(query, [cleanText, idegpt], (error, results, fields) => {
    if (error) {
      console.error('Error SQL:', error);
      res.status(500).json({ message: 'Error update en la tabla egpt', error });
      return;
    }
    res.json({ message: 'Update correcto en egpt' });
  });
});

module.exports = router;