//
// app.put('/user', async (req, res) => {...});
//
// Inserts a new user into the database, or if the
// user already exists (based on email) then the
// user's data is updated (name and bucket folder).
// Returns the user's userid in the database.
//
const dbConnection = require('./database.js')

exports.get_debug = async (req, res) => {

  console.log("call to /user...");

  try {

    var data = req.body;  // data => JS object
    console.log(data);

    sql = `
        UPDATE tennishub.assets
        SET new_bucketkey = ?,
        tracked = ?
        WHERE assetid = ?;
    `;
    new_key = "f9e46ca6-3d8f-4349-a881-a784b486e5ff/a0534439-0128-4768-a552-6b3fe7019c8a.mp4"
    params = [new_key, "done", 1028];

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
          "userid": result.insertId.toString(),
        });
      } else if (result.affectedRows === 2) {
        res.json({
          "message": "updated",
          "userid": result.insertId.toString(),
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