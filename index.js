////////////// CreateTrack ///////////////////////
'use strict';

// Added to handle injection
const vandium = require( 'vandium' );

const mysql   = require('mysql');

var pool  = mysql.createPool({
  connectionLimit : 100,
  host            : process.env.rds_host,
  user            : process.env.rds_user,
  password        : process.env.rds_password,
  database        : process.env.rds_database,
  port            : process.env.rds_port
});

exports.handler = vandium.generic()
    .handler( (event, context, callback) => {

  pool.getConnection(function (error, connection) {
    let sql = "INSERT INTO aitrl.track";

    sql = sql + " VALUES(" + connection.escape(event.name)+  ")";

  	 // Use the connection
    connection.query(sql, function (error, results, fields) {
      // When done with the connection, release it.
      connection.release();
      // Handle error after the release.
      if (error) throw error;
      else {
        var response = {};
  	    response['id'] = results.insertId;
  	    response['name'] = results.name;

	      console.log('Createtrack Response:  ', response);
  	    callback( null, response );
      }
    });
  });
});