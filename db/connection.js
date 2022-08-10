const mysql = require('mysql2');

const db = mysql.createConnection({
  user: 'root',
  password: 'Guavafruit3',
  database: 'employees'
});

module.exports = db;