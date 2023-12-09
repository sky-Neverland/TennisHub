const dbConnection = require('./database.js')
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { s3, s3_bucket_name, s3_region_name } = require('./aws.js');
const http = require('http');

exports.change_visibility = async (req, res) => {

    console.log("call to /change_visibility...");

    try {
        // get the asset id from the request:
        const userid = req.params.userid;
        const asset_id = req.params.assetid;
        const new_public = req.params.ispublic.toLowerCase();

        if (new_public !== "true" && new_public !== "false") {
            throw new Error("Unknown :ispublic value...");
        }
        // query the database to get the
        // bucket key, asset name, and user id:
        var dbResponse = await queryDatabase(asset_id, userid);

        // if the asset id is invalid, then
        // the bucket key will be empty:
        if (dbResponse.valid === 0) {
            throw new Error("Invalid combination of asset id and user id...");
        }
        result = dbResponse.result;

        await markStatus(asset_id, new_public);

        res.json({ message: "success" });

    }//try
    catch (err) {
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
        // only owner can change visibility
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

// sql = `
// UPDATE tennishub.assets
// SET new_bucketkey = ? ,
// tracked = ?
// WHERE assetid = ?;
// `

async function markStatus(asset_id, new_public) {
    sql = `
    UPDATE tennishub.assets
    SET public = ?
    WHERE assetid = ?;
  `;
    if (new_public === "true") {
        params = [true, asset_id];
    } else if (new_public === "false") {
        params = [false, asset_id];
    } else {
        throw new Error("Invalid public value...");
    }
    // wrap with a Promise object so we can use await:
    var rds_response = new Promise((resolve, reject) => {
        try {
            // execute the SQL:
            dbConnection.query(sql, params, (err, results, _) => {
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
