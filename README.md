# config
S3 bucket name: tennis-hub-dhugz
S3 bucket link: http://tennis-hub-dhugz.s3.us-east-2.amazonaws.com/

SQL server endpoint: mysql-nu-cs310.c0afbjtydkgy.us-east-2.rds.amazonaws.com

Stop DB instance:
aws rds stop-db-instance --db-instance-identifier mysql-nu-cs310

Restart DB instance:
aws rds start-db-instance --db-instance-identifier mysql-nu-cs310

Elastic Beanstalk:
application name: tennis-hub-dhugz-EB

# final project setup:
```shell
# enable python virtual env
python3 -m venv env
source env/bin/activate
pip install --upgrade pip

# download necessary python libraries
pip install matplotlib pymysql boto3

# node.js setup
pip install nodeenv
nodeenv node-env
source node-env/bin/activate

# install node.js libraries
npm install express
npm install mysql
npm install ini
npm i @aws-sdk/client-s3
npm i @aws-sdk/credential-providers

# run js file
node app.js
```
access: [localhost:8080/stats](localhost:8080/stats)

# APIs
1. app.get('/users', users.get_users);
1. app.get('/list_public_videos', lists.list_public_videos);
1. app.get('/list_user_videos/:userid', lists.list_user_videos);
1. app.get('/get_urls/:userid/:assetid', links.get_urls);
1. app.put('/user', user.put_user);
1. app.post('/upload_org_video/:userid', upload.post_video);
1. app.get('/track/:userid/:assetid', track.track);
1. app.delete('/delete_all/:userid/:assetid', delete_.delete_all);
1. app.delete('/delete_tracked/:userid/:assetid', delete_.delete_tracked);
1. app.put('/change_visibility/:userid/:assetid/:ispublic', cv.change_visibility);
