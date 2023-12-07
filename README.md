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
1. get `/users`. Return a list of users

    example usage: `users` function in `client.py`.
    
1. put `/user`: add a user to the database.

    example usage: `add_user` function in `client.py`.

1. get `/list_public_videos`: return a list of all public videos.

    example usage: `get_public_videos` function in `client.py`.

1. get `/list_user_videos/:userid`: return all videos of a user.

    example usage: `get_user_videos` function in `client.py`.

1. get `/get_urls/:userid/:assetid`: check whether `userid` can get the video urls of `asssetid`. return urls if so.

    example usage: `get_urls` function in `client.py`.

1. post `/upload_org_video/:userid`, `userid` uploads the original video.

    example usage: `upload_org_video` function in `client.py`.

1. post `/upload_new_video/:assetid`, upload the new/tracked video of `assetid`.

    example usage: `upload_new_video` function in `client.py`.
