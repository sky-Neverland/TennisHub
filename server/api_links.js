//
// app.get('/download/:assetid', async (req, res) => {...});
//
// downloads an asset from S3 bucket and sends it back to the
// client as a base64-encoded string.
//
const dbConnection = require('./database.js')
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { s3, s3_bucket_name, s3_region_name } = require('./aws.js');

exports.get_urls = async (req, res) => {

  console.log("call to /download...");

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
    var org_video_url = `https://${s3_bucket_name}.s3.${s3_region_name}.amazonaws.com/${org_bucketkey}`;

    var new_bucketkey = result.new_bucketkey;
    var new_video_url = `https://${s3_bucket_name}.s3.${s3_region_name}.amazonaws.com/${new_bucketkey}`;

    // setup the response object:
    res.json({
      "message": "success",
      "userid": result.userid,
      "assetname": result.assetname,
      "tracked": result.tracked,
      "org_video_url": org_video_url,
      "new_video_url": new_video_url,
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
      "userid": -1,
      "tracked": "",
      "assetname": "",
      "org_video_url": "",
      "new_video_url": "",
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
    if (results[0].public == 0 && results[0].userid != request_user_id) {
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