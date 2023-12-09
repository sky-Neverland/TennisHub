//
// app.post('/video/:userid', async (req, res) => {...});
//
// Uploads an video to the bucket and updates the database,
// returning the asset id assigned to this video.
//
const dbConnection = require('./database.js')
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { s3, s3_bucket_name, s3_region_name } = require('./aws.js');

const uuid = require('uuid');

exports.post_video = async (req, res) => {

  console.log("call to /post_video...");

  try {
    const userid = req.params.userid;
    var data = req.body;  // data => JS object
    // console.log(data.data);


    getBucketFolderRes = await getBucketFolder(userid);
    if (getBucketFolderRes.is_valid_user === 0) {
      throw new Error("no such user...");
    }

    bucketfolder = getBucketFolderRes.bucketfolder;
    console.log(bucketfolder);

    var video_bytes = Buffer.from(data.data, 'base64');

    var new_local_name = uuid.v4();
    var bucket_key = `${bucketfolder}/${new_local_name}.mp4`;

    console.log(`bucket_key is ${bucket_key}`);

    const command = new PutObjectCommand({
      Bucket: s3_bucket_name,
      Key: bucket_key,
      Body: video_bytes,
      ACL: 'public-read',
      ContentType: 'video/mp4',
    });

    s3_promise = s3.send(command);

    var dummy_bucket_name = uuid.v4();
    var dummy_new_bucket_key = `invalid-${dummy_bucket_name}`;

    var rds_promise = new Promise((resolve, reject) => {
      try {
        console.log("upload_org: calling RDS...");
        sql = `
                INSERT INTO
                tennishub.assets(userid, assetname, org_bucketkey, new_bucketkey, tracked, public)
                values(?, ?, ?, ?, ?, ?);
            `
        sql_params = [userid, data.assetname, bucket_key, dummy_new_bucket_key, "untracked", data.isPublic];
        dbConnection.query(sql, sql_params, (err, results, _) => {
          try {
            if (err) {
              console.log("upload_org: rejected RDS promise...");
              reject(err);
              return;
            }
            console.log("upload_org: before resolve...");
            resolve(results);
          }
          catch (code_err) {
            console.log("upload_org: error in db query...");
            reject(code_err);
          }
        });
      }
      catch (code_err) {
        console.log("upload_org: error in db query 22...");
        reject(code_err);
      }
    });

    Promise.all([s3_promise, rds_promise]).then(results => {
      try {
        // we have a list of results, so break them apart:
        console.log("Promise.all done...");
        var s3_result = results[0];
        var rds_results = results[1];
        console.log("Promise done, sending response...");

        res.json({
          "message": "success",
          "data": [{
            "assetid": rds_results.insertId.toString(),
            "userid": userid,
            "assetname": data.assetname,
            "org_bucketkey": bucket_key,
            "new_bucketkey": "invalid-bucketkey",
            "org_video_url": `https://${s3_bucket_name}.s3.${s3_region_name}.amazonaws.com/${bucket_key}`,
            "new_video_url": "invalid-url",
            "tracked": "untracked",
            "public": data.isPublic,
          },],
        });
      }
      catch (code_err) {
        console.log("Promise.all try catch err...");
        res.status(400).json({
          "message": code_err.message,
          "data": [],
        });
      }
    }).catch(err => {
      console.log("Promise.all err...");
      res.status(400).json({
        "message": err.message,
        "data": [],
      });
    });
  }//try
  catch (err) {
    console.log("**ERROR:", err.message);

    res.status(400).json({
      "message": err.message,
      "data": []
    });
  }//catch

}//post org video

// exports.post_tracked_video = async (req, res) => {

//   console.log("call to /post_tracked_video...");

//   try {
//     const assetid = req.params.assetid;
//     var data = req.body;
//     getAssetInfoRes = await getAssetInfo(assetid);
//     if (getAssetInfoRes.valid === 0) {
//       throw new Error("invalid asset id...");
//     }
//     console.log(getAssetInfoRes.result);

//     getBucketFolderRes = await getBucketFolder(getAssetInfoRes.result.userid);
//     if (getBucketFolderRes.is_valid_user === 0) {
//       throw new Error("no such user...");
//     }

//     bucketfolder = getBucketFolderRes.bucketfolder;

//     // re-construc the video bytes from the base64-encoded string:
//     // var video_bytes = data.data;
//     var video_bytes = Buffer.from(data.data, 'base64');

//     var new_local_name = uuid.v4();
//     var bucket_key = `${bucketfolder}/${new_local_name}.mp4`;

//     console.log(`bucket_key is ${bucket_key}`);

//     const command = new PutObjectCommand({
//       Bucket: s3_bucket_name,
//       Key: bucket_key,
//       Body: video_bytes,
//       ACL: 'public-read',
//       ContentType: 'video/mp4',
//     });

//     s3_promise = s3.send(command);



//     var rds_promise = new Promise((resolve, reject) => {
//       try {
//         console.log("upload_org: calling RDS...");
//         sql = `
//           UPDATE tennishub.assets
//           SET new_bucketkey = ? ,
//           tracked = ?
//           WHERE assetid = ?;
//         `
//         sql_params = [bucket_key, "done", assetid];
//         dbConnection.query(sql, sql_params, (err, results, _) => {
//           try {
//             if (err) {
//               console.log("upload_new: rejected RDS promise...");
//               reject(err);
//               return;
//             }
//             console.log("upload_new: before resolve...");
//             resolve(results);
//           }
//           catch (code_err) {
//             console.log("upload_new: error in db query...");
//             reject(code_err);
//           }
//         });
//       }
//       catch (code_err) {
//         console.log("upload_new: error in db query 22...");
//         reject(code_err);
//       }
//     });

//     Promise.all([s3_promise, rds_promise]).then(results => {
//       try {
//         // we have a list of results, so break them apart:
//         console.log("Promise.all done...");
//         var s3_result = results[0];
//         var rds_results = results[1];
//         console.log("Promise done, sending response...");

//         res.json({
//           "message": "success",
//           "bucketkey": bucket_key,
//           "url": `https://${s3_bucket_name}.s3.${s3_region_name}.amazonaws.com/${bucket_key}`,
//         });
//       }
//       catch (code_err) {
//         console.log("Promise.all try catch err...");
//         res.status(400).json({
//           "message": code_err.message,
//           "assetid": -1,
//         });
//       }
//     }).catch(err => {
//       console.log("Promise.all err...");
//       res.status(400).json({
//         "message": err.message,
//         "assetid": "-1",
//       });
//     });
//   }//try
//   catch (err) {
//     console.log("**ERROR:", err.message);

//     res.status(400).json({
//       "message": err.message,
//       "assetid": -1
//     });
//   }//catch

// }//post

// async query the database to get the bucket folder of the user.
//
// @param userid the user's id
// @return bucket folder of the user, "" if user not found
async function getBucketFolder(userid) {
  sql = `
        SELECT bucketfolder FROM tennishub.users where userid = ? ;
    `;

  // wrap with a Promise object so we can use await:
  var rds_response = new Promise((resolve, reject) => {
    try {
      // execute the SQL:
      dbConnection.query(sql, [userid], (err, results, _) => {
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

  // valid user id:
  if (results.length > 0) {
    return {
      is_valid_user: 1,
      bucketfolder: results[0].bucketfolder,
    };
  }

  // invalid asset id:
  return {
    is_valid_user: 0,
    bucketfolder: "",
  };
}

async function getAssetInfo(assetid) {
  try {

    sql = `
    SELECT userid, assetname, org_bucketkey, new_bucketkey, tracked, public
    FROM tennishub.assets
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
    results = await rds_response;

    // valid user id:
    if (results.length > 0) {
      return {
        valid: 1,
        result: results[0],
      };
    }

    // invalid asset id:
    return {
      valid: 0,
    };
  }
  catch (code_err) {
    return {
      valid: 0,
    };
  }
}