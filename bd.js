const mysql = require('mysql');
require("dotenv").config();
/**esta conexion de de tipo Pool pero va el nombre connection */
const connection = mysql.createPool({
  connectionLimit: 10,
  host: process.env.MY_HOST,
  user: process.env.MY_USER,
  password: process.env.MY_PASSWORD,
  database: process.env.MY_DB
});

// Test de conexión al iniciar
connection.getConnection((err, connection) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
  } else {
    console.log("Conexión a MySQL exitosa.");
    connection.release();
  }
});

// Reemplaza todas tus llamadas connection.query(...) con pool.query(...)
function insertarInformacion(titulo, contenido) {
  const limpiesito = contenido.replace(/'/g, "''");
  const sql = "INSERT INTO egpt (titulocons, consultxt, fechahorareg) VALUES (?, ?, NOW())";
  return new Promise((resolve, reject) => {
    pool.query(sql, [limpiesito, titulo, contenido], (err, result) => {
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
  const sql = "UPDATE egpt SET resptxt = ? WHERE idegpt = ?";
  return new Promise((resolve, reject) => {
    pool.query(sql, [resptxt, idegpt], (err, result) => {
      if (err) {
        console.error('Error update:', err);
        reject(err);
      } else {
        console.log('Update OK egpt.');
        resolve(result.insertId);
      }
    });
  });
}

async function lastIdGpt() {
  const sql = "SELECT idegpt FROM egpt ORDER BY idegpt DESC LIMIT 1";
  try {
    const result = await new Promise((resolve, reject) => {
      pool.query(sql, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    return result.length > 0 ? result[0].idegpt : null;
  } catch (err) {
    console.error('Error URL idegpt:', err);
    throw err;
  }
}

// Funciones con 'connection' como parámetro las puedes adaptar si las necesitas aún
function limpiaEimage() {
  const sql1 = "DELETE FROM eimage;";
  const sql2 = "ALTER TABLE eimage AUTO_INCREMENT = 1;";
  pool.query(sql1, (err) => {
    if (err) console.error('Error:', err);
    else console.log('DELETED eimage ok');
    pool.query(sql2, (err) => {
      if (err) console.error('Error:', err);
      else console.log('INI eimage ok');
    });
  });
}

function limpiaImgId(id) {
  const sql1 = "DELETE FROM eimage WHERE idportal=?;";
  pool.query(sql1, [id], (err) => {
    if (err) console.error('Error:', err);
    else console.log(`DELETED eimage id =${id} ok`);
  });
}

// Aquí van los tokens Google (pueden quedarse como están)

const axios = require('axios');
async function getAccessTokenFromCode(code) {
  const url = 'https://oauth2.googleapis.com/token';
  const values = {
    code,
    client_id: process.env.CLIENTID,
    client_secret: process.env.CLIENTSECRET,
    redirect_uri: process.env.REDIRECTURI,
    grant_type: 'authorization_code'
  };
  try {
    console.log('getTokensFromCode');
    const response = await axios.post(url, new URLSearchParams(values), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    const accessToken = response.data.access_token;
    const idToken = response.data.id_token;
    await validarToken2(idToken);
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
  } catch (error) {
    console.error('Error al validar el ID token:', error.response?.data || error.message);
  }
}

module.exports = {
  connection,
  insertarInformacion,
  updateGpt,
  lastIdGpt,
  limpiaEimage,
  limpiaImgId,
  getAccessTokenFromCode
};
