//
// app.get('/assets', async (req, res) => {...});
//
// Return all the assets from the database:
//
const dbConnection = require('./database.js')
const { s3, s3_bucket_name, s3_region_name } = require('./aws.js');
// const s3_region_name = tennishub_config.s3readonly.region_name;  // us-east-2
// const s3_bucket_name = tennishub_config.s3.bucket_name;  // tennis-hub-dhugz

exports.list_public_videos = async (req, res) => {

  console.log("call to /list_public_videos...");

  try {

    // SQL that gets all the assets from the database:
    var sql = `
      SELECT assetid, userid, assetname, org_bucketkey, new_bucketkey, tracked, public
      FROM tennishub.assets
      WHERE public = 1 
      ORDER BY assetid ASC;
    `;

    // Execute the SQL:
    dbConnection.query(sql, (queryError, results) => {
      if (queryError) {  // handle query errors
        console.error('Error executing query:', queryError);
        res.status(400).json({
          "message": queryError,
          "data": []
        });
        return;
      } // end: handle query errors

      // https://tennis-hub-dhugz.s3.us-east-2.amazonaws.com/4d7c577c-022c-4ee9-8673-dfd0642b8dea/4dc33018-6887-4d24-bda6-eb305866ad8a.mp4
      // for asset in results
      //   org_bucketkey = asset.org_bucketkey
      //   org_video_url = `https://${s3_bucket_name}.s3.${s3_region_name}.amazonaws.com/${org_bucketkey}`
      //   asset.org_video_url = org_video_url
      for (var i = 0; i < results.length; i++) {
        var org_bucketkey = results[i].org_bucketkey;
        var org_video_url = `https://${s3_bucket_name}.s3.${s3_region_name}.amazonaws.com/${org_bucketkey}`;
        results[i].org_video_url = org_video_url;

        var new_bucketkey = results[i].new_bucketkey;
        var new_video_url = `https://${s3_bucket_name}.s3.${s3_region_name}.amazonaws.com/${new_bucketkey}`;
        results[i].new_video_url = new_video_url;
      }

      // setup the response object:
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

exports.list_user_videos = async (req, res) => {

  console.log("call to /list_private_videos...");

  try {
    const userid = req.params.userid;

    // SQL that gets all the assets from the database:
    var sql = `
      SELECT assetid, userid, assetname, org_bucketkey, new_bucketkey, tracked, public
      FROM tennishub.assets
      WHERE userid = ?
      ORDER BY assetid ASC;
    `;

    // Execute the SQL:
    dbConnection.query(sql, [userid], (queryError, results) => {
      if (queryError) {  // handle query errors
        console.error('Error executing query:', queryError);
        res.status(400).json({
          "message": queryError,
          "data": []
        });
        return;
      } // end: handle query errors

      // https://tennis-hub-dhugz.s3.us-east-2.amazonaws.com/4d7c577c-022c-4ee9-8673-dfd0642b8dea/4dc33018-6887-4d24-bda6-eb305866ad8a.mp4
      // for asset in results
      //   org_bucketkey = asset.org_bucketkey
      //   org_video_url = `https://${s3_bucket_name}.s3.${s3_region_name}.amazonaws.com/${org_bucketkey}`
      //   asset.org_video_url = org_video_url
      for (var i = 0; i < results.length; i++) {
        var org_bucketkey = results[i].org_bucketkey;
        var org_video_url = `https://${s3_bucket_name}.s3.${s3_region_name}.amazonaws.com/${org_bucketkey}`;
        results[i].org_video_url = org_video_url;

        var new_bucketkey = results[i].new_bucketkey;
        var new_video_url = `https://${s3_bucket_name}.s3.${s3_region_name}.amazonaws.com/${new_bucketkey}`;
        results[i].new_video_url = new_video_url;
      }

      // setup the response object:
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
