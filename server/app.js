//
// Express js (and node.js) web service that interacts with 
// AWS S3 and RDS to provide clients data for building a 
// simple photo application for photo storage and viewing.
//
// Project 02 for CS 310, Spring 2023.
//
// Authors:
//  Zanhua Huang
//  Prof. Joe Hummel (initial template)
//  Northwestern University
//  Spring 2023
//
// References:
// Node.js: 
//   https://nodejs.org/
// Express: 
//   https://expressjs.com/
// MySQL: 
//   https://expressjs.com/en/guide/database-integration.html#mysql
//   https://github.com/mysqljs/mysql
// AWS SDK with JS:
//   https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html
//   https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started-nodejs.html
//   https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/
//   https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_s3_code_examples.html
//

const express = require('express');
const app = express();
const config = require('./config.js');

const dbConnection = require('./database.js')
const { HeadBucketCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { s3, s3_bucket_name, s3_region_name } = require('./aws.js');
var startTime;

app.all('*', function (req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', '*');
  res.set('Access-Control-Allow-Methods', '*');
  next();
});

app.use(express.json({ strict: false, limit: "50mb" }));

app.listen(config.service_port, () => {
  startTime = Date.now();
  console.log('web service running...');
  //
  // Configure AWS to use our config file:
  //
  process.env.AWS_SHARED_CREDENTIALS_FILE = config.tennishub_config;
});

app.get('/', (req, res) => {

  var uptime = Math.round((Date.now() - startTime) / 1000);

  res.json({
    "status": "running",
    "uptime-in-secs": uptime,
    "dbConnection": dbConnection.state
  });
});

// service functions:
var users = require('./api_users.js');
var lists = require('./api_lists.js');
var user = require('./api_user.js');
var upload = require('./api_upload.js');
var links = require('./api_links.js');
var track = require('./api_track.js');
var delete_ = require('./api_delete.js');
var cv = require('./api_change_visibility.js');
var debug = require('./api_debug.js');

app.get('/users', users.get_users);
app.get('/list_public_videos', lists.list_public_videos);
app.get('/list_user_videos/:userid', lists.list_user_videos);
app.get('/get_urls/:userid/:assetid', links.get_urls);
app.put('/user', user.put_user);
app.post('/upload_org_video/:userid', upload.post_video);
// app.post('/upload_tracked_video/:userid:assetid', upload.post_tracked_video);
app.get('/track/:userid/:assetid', track.track);
app.delete('/delete_all/:userid/:assetid', delete_.delete_all);
app.delete('/delete_tracked/:userid/:assetid', delete_.delete_tracked);
app.put('/change_visibility/:userid/:assetid/:ispublic', cv.change_visibility);

app.get('/debug', debug.get_debug);
