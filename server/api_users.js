//
// app.get('/users', async (req, res) => {...});
//
// Return all the users from the database:
//
const dbConnection = require('./database.js')

exports.get_users = async (req, res) => {

  console.log("call to /users...");

  try {

    var sql = `
      SELECT userid, email, lastname, firstname, bucketfolder
      FROM tennishub.users
      ORDER BY userid ASC;
    `;

    // Execute the SQL:
    dbConnection.query(sql, (queryError, results) => {
      // handle query errors
      if (queryError) {
        console.error('Error executing query:', queryError);
        res.status(400).json({
          "message": queryError,
          "data": []
        });
        return;
      }

      console.log('Query no error.');

      // no error, setup the response object:
      res.json({
        "message": "success",
        "data": results,
      });
    });

  }//try
  catch (err) {
    res.status(400).json({
      "message": err.message,
      "data": []
    });
  }//catch

}//get
