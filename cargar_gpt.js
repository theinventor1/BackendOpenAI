const express = require('express');
const { connection } = require('./bd.js');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('cargar_gpt');
    connection.query('SELECT idegpt, titulocons, consultxt, resptxt, fechahorareg FROM egpt WHERE 1 ORDER BY idegpt DESC LIMIT 3',(error, results, fields) => {
        if (error) {
            res.status(500).json({ message: 'Error al cargar egpt', error });
            return;
        }
        res.json(results);
    });
});

module.exports = router;
