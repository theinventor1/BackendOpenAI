const express = require('express');
const { connection }= require('./bd.js');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('cargar_descximgs');
    const pagina = parseInt(req.query.pagina) || 1;
    const porPagina = parseInt(req.query.limite) || 4;
    const offset = (pagina - 1) * porPagina;
    connection.query('SELECT COUNT(*) AS total FROM imagenxdesc WHERE urlresultado <> "" ', (error, countResult, fields) => {
        if (error) {
            res.status(500).json({ message: 'Error al obtener la cantidad total de registros', error });
            return;
        }
        const totalRegistros = countResult[0].total;
        const totalPages = Math.ceil(totalRegistros / porPagina);
        connection.query('SELECT idimagenxdesc, prompt,imagesize, urlresultado, fechahorareg FROM imagenxdesc WHERE urlresultado <> "" ORDER BY idimagenxdesc DESC LIMIT ? OFFSET ?', [porPagina, offset], (error, results, fields) => {
            if (error) {
                res.status(500).json({ message: 'Error al cargar iaimagen', error });
                return;
            }
            res.json({                
                total: totalRegistros,
                paginaActual: pagina,
                porPagina: porPagina,
                totalPages: totalPages,
                data: results,
            });
        });
    });
});

module.exports = router;