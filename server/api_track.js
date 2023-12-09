const dbConnection = require('./database.js')
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { s3, s3_bucket_name, s3_region_name } = require('./aws.js');
const http = require('http');

exports.track = async (req, res) => {

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


    var org_bucketkey = result.org_bucketkey;
    var org_video_url = `https://${s3_bucket_name}.s3.${s3_region_name}.amazonaws.com/${org_bucketkey}`;

    var new_bucketkey = result.new_bucketkey;
    var new_video_url = `https://${s3_bucket_name}.s3.${s3_region_name}.amazonaws.com/${new_bucketkey}`;
    var tracked = result.tracked;

    // tracked: "done", "pending", "untracked"
    // if done
    if (tracked === "done") {
      res.json({
        "message": "success",
        "data": [{
          "assetid": asset_id,
          "userid": result.userid,
          "assetname": result.assetname,
          "org_bucketkey": org_bucketkey,
          "new_bucketkey": new_bucketkey,
          "org_video_url": org_video_url,
          "new_video_url": new_video_url,
          "tracked": "done",
          "public": result.isPublic,
        },],
      });
      return;
    }
    // if not tracked
    if (tracked === "untracked") {
      res.status(400).json({
        "message": "track server api not available",
        data: []
      });
      return;
      // TODO: mark "pending"
      await markStatus("pending", asset_id, new_bucketkey);
      // TODO: send a get request to TRACK_URL, update new_video_url

      new_video_url = ""
      // TODO: update database
      await markStatus("done", asset_id, new_bucketkey);
      res.json({
        "message": "untracked",
        "org_video_url": "",
        "new_video_url": "",
      });
      return;
    }
    if (tracked === "pending") {
      res.status(400).json({
        "message": "pending",
        data: []
      });
    }

  }//try
  catch (err) {
    //
    // generally we end up here if we made a 
    // programming error, like undefined variable
    // or function:
    //
    res.status(400).json({
      "message": err.message,
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

// sql = `
// UPDATE tennishub.assets
// SET new_bucketkey = ? ,
// tracked = ?
// WHERE assetid = ?;
// `

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

async function askTrackServer(org_video_url, org_bucketkey) {

  // Define the URL you want to make a GET request to
  const url = 'http://tennis-hub-dhugz-eb-env.eba-9ewfn4s2.us-east-2.elasticbeanstalk.com/list_user_videos/80004';

  console.log("url: " + org_video_url);
  console.log("bucketkey: " + org_bucketkey);
  bucketfolder = org_bucketkey.split("/")[0];
  console.log("bucketfolder: " + bucketfolder);
  decoded_url = Buffer.from(org_video_url).toString('base64');
  console.log("decoded_url: " + decoded_url);
  var get_promise = new Promise((resolve, reject) => {
    try {
      http.get(url, (response) => {
        let data = '';
    
        // When data is received, append it to the 'data' variable
        response.on('data', (chunk) => {
          data += chunk;
        });
    
        // When the response is complete, process the data
        response.on('end', () => {
          to_return = {
            valid: 1,
            response: JSON.parse(data),
          };
          resolve(to_return);
        });
      }).on('error', (error) => {
        to_return = {
          valid: 0,
          response: JSON.parse(data),
        };
        reject(to_return);
      });
    }
    catch (code_err) {
      reject(code_err);
    }
  });

  result = await get_promise;
  return result;


  // Send an HTTP GET request
  
}