const mysql = require("mysql");

const databaseConfiguration = {

    host: "sql7.freemysqlhosting.net", // or server
    user: "sql7254337",
    password: "Cp7kRtwNQ7",
    database: "sql7254337"
    }
const connection  = mysql.createConnection(databaseConfiguration);
connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('connected as id ' + connection.threadId);
  });
  module.exports = {
      connection
    };