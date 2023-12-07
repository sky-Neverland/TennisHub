--
-- assume this was already done: CREATE DATABASE tennishub;
--

USE tennishub;

DROP TABLE IF EXISTS tennishub.assets;
DROP TABLE IF EXISTS tennishub.users;

CREATE TABLE tennishub.users
(
    userid       int not null AUTO_INCREMENT,
    email        varchar(128) not null,
    lastname     varchar(64) not null,
    firstname    varchar(64) not null,
    bucketfolder varchar(48) not null,  -- random, unique name (UUID)
    PRIMARY KEY (userid),
    UNIQUE      (email),
    UNIQUE      (bucketfolder)
);

ALTER TABLE tennishub.users AUTO_INCREMENT = 80001;  -- starting value

CREATE TABLE tennishub.assets
(
    assetid      int not null AUTO_INCREMENT,
    userid       int not null,
    assetname    varchar(128) not null,  -- original name from user
    org_bucketkey    varchar(128) not null,  -- random, unique name in bucket
    new_bucketkey    varchar(128) not null,  -- random, unique name in bucket
    tracked varchar(128) not null, -- "not started", "pending", "done"
    public      boolean not null,  -- true = public, false = private
    PRIMARY KEY (assetid),
    FOREIGN KEY (userid) REFERENCES users(userid),
    UNIQUE      (org_bucketkey),
    UNIQUE      (new_bucketkey)
);

ALTER TABLE tennishub.assets AUTO_INCREMENT = 1001;  -- starting value

--
-- DONE
--