const axios = require('axios');
// const validarToken = require('./valtoken');
const mysql = require('mysql');
require("dotenv").config();
const myhost     = process.env.MY_HOST;
const myuser     = process.env.MY_USER;
const mypassword = process.env.MY_PASSWORD;
const mydatabase = process.env.MY_DB;

var connection = mysql.createConnection({
 connectionLimit : 10,
 host: myhost,
 user: myuser,
 password: mypassword,
 database: mydatabase
});

connection.connect((err) => {
  if (err) {
    console.error('Error conectar base de datos:', err);
    return;
  }
  console.log('Conexión correcta.');  
});

connection.on('error', function(err) {
 console.error('db error', err);
 if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
   console.log('Reconectando...');
   connection = mysql.createConnection(connection.config);
   connection.connect();
 } else {
   throw err;
 }
});

function insertarInformacion(titulo, contenido) {
 const limpiesito = contenido.replace(/'/g, "''");
 const sql = "INSERT INTO egpt (titulocons, consultxt, fechahorareg) VALUES (?, ?, NOW())";
 return new Promise((resolve, reject) => {
   connection.query(sql, [limpiesito, titulo, contenido], (err, result) => {
     if (err) {
       console.error('Error insertar:', err);
       reject(err);
     } else {
       console.log('Insertado OK egpt.');
       resolve(result.insertId); 
     }
     });
 });
}

function updateGpt(idegpt, resptxt) {
 const sql = "UPDATE egpt SET resptxt = '" + resptxt + "' WHERE idegpt = " + idegpt + " ";
 return new Promise((resolve, reject) => {
   connection.query(sql, (err, result) => {
     if (err) {
       console.error('Error update:', err);
       reject(err);
     } else {
       console.log('update OK egpt.');
       resolve(result.insertId); 
     }
     });
 });
}

async function lastIdGpt() {
 const sql = "SELECT idegpt FROM egpt WHERE 1 ORDER BY idegpt DESC LIMIT 1";
 try {
     const result = await new Promise((resolve, reject) => {
       connection.query(sql, (err, result) => {
       if (err) { reject(err);  } 
       else { resolve(result);  }
       });
     });     
     if (result && result.length > 0) { return result[0].idegpt;  } 
     else {  throw new Error("No idegpt");  }
 } 
 catch (err) {
     console.error('Error URL idegpt:', err);
     throw err;
 }
}

function obtenerUltimaConsulta(id, connection) {
 const sql = "SELECT idconsulta FROM consulta WHERE idportal="+id+" ORDER BY idconsulta DESC LIMIT 1";
 return connection.query(sql, (err, result) => {
     if (err) {  console.error('Error al obtener la última consulta:', err);    
     } else {  const idConsulta = result.length > 0 ? result[0].idconsulta : null;    
     }
 });
}

function limpiaEimage(connection){
 const sql1 = "DELETE FROM eimage;";
 connection.query(sql1, (err, result) => { if (err) { console.error('Error:', err); return; }
 console.log('DELETED eimage ok ');  } );
 const sql2 = "ALTER TABLE eimage AUTO_INCREMENT = 1;";
 connection.query(sql2, (err, result) => { if (err) { console.error('Error:', err); return; }   
 console.log('INI eimage ok '); } ); 
}

function limpiaImgId(id, connection){
 const sql1 = "DELETE FROM eimage WHERE idportal="+id+";";
 connection.query(sql1, (err, result) => { if (err) { console.error('Error:', err); return; }
 console.log("DELETED eimage id ="+id+" ok ");  } );
}

async function getAccessTokenFromCode(code) {
 const clientId = process.env.CLIENTID;
 const redirectUri = process.env.REDIRECTURI;
 const clientSecret = process.env.CLIENTSECRET;
 const url = 'https://oauth2.googleapis.com/token';
 const values = {
     code,
     client_id: clientId,
     client_secret: clientSecret,
     redirect_uri: redirectUri,
     grant_type: 'authorization_code'
 };
 try {
     console.log('getTokensFromCode');
     const response = await axios.post(url, new URLSearchParams(values), {
         headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
     });
     const accessToken = response.data.access_token; // Extrae el token de acceso
     const idToken = response.data.id_token; // Extrae el ID token
    await validarToken2(idToken); // Valida el ID token
     return response.data;
 } catch (error) {
     console.error('Failed to exchange code for tokens:', error);
     throw error;
 }
}

async function validarToken2(idToken) {
 try {
     const response = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${idToken}`);
     console.log(response.data);
     // Aquí puedes manejar la respuesta como desees
 } catch (error) {
     console.error('Error al validar el ID token:', error.response.data);
     // Aquí puedes manejar el error como desees
 }
}

module.exports = { connection, limpiaEimage, limpiaImgId,  obtenerUltimaConsulta, insertarInformacion, lastIdGpt, updateGpt, getAccessTokenFromCode };