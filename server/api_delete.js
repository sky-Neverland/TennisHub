const dbConnection = require('./database.js')
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { s3, s3_bucket_name, s3_region_name } = require('./aws.js');
const http = require('http');

exports.delete_all = async (req, res) => {

  console.log("call to /delete_all...");

  try {
    // get the asset id from the request:
    const userid = req.params.userid;
    const asset_id = req.params.assetid;

    // query the database to get the
    // bucket key, asset name, and user id:
    var dbResponse = await queryDatabase(asset_id, userid);

    // if the asset id is invalid, then
    // the bucket key will be empty:
    if (dbResponse.valid === 0) {
      throw new Error("Invalid combination of asset id and user id...");
    }
    result = dbResponse.result;
    // console.log("------")
    // console.log(result)

    var org_bucketkey = result.org_bucketkey;
    var new_bucketkey = result.new_bucketkey;
    var tracked = result.tracked;

    if (tracked === "pending") {
      throw new Error("Cannot delete a pending video...");
    }

    deleteRowPromise = deleteRow(asset_id);

    var input1 = {
      Bucket: s3_bucket_name,
      Key: org_bucketkey,
    };

    // execute the DeleteObjectCommand:
    const command1 = new DeleteObjectCommand(input1);

    var input2 = {
      Bucket: s3_bucket_name,
      Key: new_bucketkey,
    };

    // execute the DeleteObjectCommand:
    const command2 = new DeleteObjectCommand(input2);

    if (tracked === "done") {
      await s3.send(command2);
    }

    await s3.send(command1);
    await deleteRowPromise;

    res.status(200).json({
      "message": "success",
    });

  }//try
  catch (err) {
    //
    // generally we end up here if we made a 
    // programming error, like undefined variable
    // or function:
    //
    res.status(400).json({
      "message": err.message,
    });
  }//catch

}//get

exports.delete_tracked = async (req, res) => {

  console.log("call to /delete_all...");

  try {
    // get the asset id from the request:
    const userid = req.params.userid;
    const asset_id = req.params.assetid;

    // query the database to get the
    // bucket key, asset name, and user id:
    var dbResponse = await queryDatabase(asset_id, userid);

    // if the asset id is invalid, then
    // the bucket key will be empty:
    if (dbResponse.valid === 0) {
      throw new Error("Invalid combination of asset id and user id...");
    }
    result = dbResponse.result;
    // console.log("------")
    // console.log(result)

    // var org_bucketkey = result.org_bucketkey;
    var new_bucketkey = result.new_bucketkey;
    var tracked = result.tracked;

    if (tracked === "pending") {
      throw new Error("Cannot delete a pending video...");
    }
    if (tracked === "untracked") {
      throw new Error("Cannot delete an untracked video...");
    }

    updateRowPromise = markStatus("untracked", asset_id, new_bucketkey);

    var input = {
      Bucket: s3_bucket_name,
      Key: new_bucketkey,
    };

    // execute the DeleteObjectCommand:
    const command = new DeleteObjectCommand(input);


    await s3.send(command);

    await updateRowPromise;

    res.status(200).json({
      "message": "success",
    });

  }//try
  catch (err) {
    //
    // generally we end up here if we made a 
    // programming error, like undefined variable
    // or function:
    //
    res.status(400).json({
      "message": err.message,
    });
  }//catch

}//get

// async query the database to get the bucket key, asset name, and user id
// for the given asset id:
//
// @param asset_id the asset id
// @return a dictionary containing bucket key, asset name, and user id.
async function queryDatabase(asset_id, request_user_id) {
  sql = `
    SELECT userid, assetname, org_bucketkey, new_bucketkey, tracked, public
    FROM tennishub.assets
    where assetid = ? ;
  `;

  // wrap with a Promise object so we can use await:
  var rds_response = new Promise((resolve, reject) => {
    try {
      // execute the SQL:
      dbConnection.query(sql, [asset_id], (err, results, _) => {
        try {
          if (err) {
            reject(err);
            return;
          }
          resolve(results);
        }
        catch (code_err) {
          reject(code_err);
        }
      });
    }
    catch (code_err) {
      reject(code_err);
    }
  });

  // wait for the promise to resolve:
  results = await rds_response;

  // valid asset id:
  if (results.length > 0) {
    // only owner can delete
    if (results[0].userid != request_user_id) {
      return {
        valid: 0,
      };
    }
    return {
      valid: 1,
      result: results[0],
    }
  }

  // invalid asset id:
  return {
    valid: 0,
  };
}

async function deleteRow(assetid) {
  sql = `
    DELETE FROM tennishub.assets
    where assetid = ? ;
  `;

  // wrap with a Promise object so we can use await:
  var rds_response = new Promise((resolve, reject) => {
    try {
      // execute the SQL:
      dbConnection.query(sql, [assetid], (err, results, _) => {
        try {
          if (err) {
            reject(err);
            return;
          }
          resolve(results);
        }
        catch (code_err) {
          reject(code_err);
        }
      });
    }
    catch (code_err) {
      reject(code_err);
    }
  });

  // wait for the promise to resolve:
  await rds_response;
}


async function markStatus(status, asset_id, new_bucketkey) {
  sql = "";
  params = [];
  if (status === "done") {
    sql = `
    UPDATE tennishub.assets
    SET tracked = ?, new_bucketkey = ?
    WHERE assetid = ?;
  `;
    params = [status, new_bucketkey, asset_id];
  } else if (status === "pending") {
    sql = `
    UPDATE tennishub.assets
    SET tracked = ?
    WHERE assetid = ?;
  `;
    params = [status, asset_id];
  } else if (status === "untracked") {
    sql = `
    UPDATE tennishub.assets
    SET tracked = ?
    WHERE assetid = ?;
  `;
  params = [status, asset_id];
  }


  // wrap with a Promise object so we can use await:
  var rds_response = new Promise((resolve, reject) => {
    try {
      // execute the SQL:
      dbConnection.query(sql, [status, new_bucketkey, asset_id], (err, results, _) => {
        try {
          if (err) {
            reject(err);
            return;
          }
          resolve(results);
        }
        catch (code_err) {
          reject(code_err);
        }
      });
    }
    catch (code_err) {
      reject(code_err);
    }
  });

  // wait for the promise to resolve:
  results = await rds_response;
}
