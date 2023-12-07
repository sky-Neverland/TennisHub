//
// app.put('/user', async (req, res) => {...});
//
// Inserts a new user into the database, or if the
// user already exists (based on email) then the
// user's data is updated (name and bucket folder).
// Returns the user's userid in the database.
//
const dbConnection = require('./database.js')

exports.put_user = async (req, res) => {

  console.log("call to /user...");

  try {

    var data = req.body;  // data => JS object
    console.log(data);
    sql = `
      INSERT INTO tennishub.users (email, lastname, firstname, bucketfolder)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      email = VALUES(email),
      lastname = VALUES(lastname),
      firstname = VALUES(firstname),
      bucketfolder = VALUES(bucketfolder);
    `
    params = [data.email, data.lastname, data.firstname, data.bucketfolder];

    dbConnection.query(sql, params, (queryError, result) => {
      // handle query errors
      if (queryError) {
        console.error('Error executing query:', queryError);
        res.status(400).json({
          "message": queryError,
          "userid": -1,
        });
        return;
      }

      console.log('Query no error.');
      console.log(result);
      console.log(result.insertId);
      console.log(result.affectedRows);
      if (result.affectedRows === 1) {
        res.json({
          "message": "inserted",
          "userid": result.insertId,
        });
      } else if (result.affectedRows === 2) {
        res.json({
          "message": "updated",
          "userid": result.insertId,
        });
      }

      // no error, setup the response object:
      
    });
  }//try
  catch (err) {
    console.log("**ERROR:", err.message);

    res.status(400).json({
      "message": err.message,
      "userid": -1
    });
  }//catch

}//put