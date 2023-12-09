import requests  # calling web service
import jsons  # relational-object mapping

import uuid
import pathlib
import logging
import sys
import os
import base64

from configparser import ConfigParser

sys.tracebacklimit = 0
# config_file = 'tennishub-client-config.ini'
# if not pathlib.Path(config_file).is_file():
#     print("**ERROR: config file '", config_file, "' does not exist, exiting")
#     sys.exit(0)
# configur = ConfigParser()
# configur.read(config_file)
baseurl = "http://tennis-hub-dhugz-eb-env.eba-9ewfn4s2.us-east-2.elasticbeanstalk.com"
# baseurl = "http://localhost:8080"

###################################################################
#
# classes
#


class User:
    userid: int  # these must match columns from DB table
    email: str
    lastname: str
    firstname: str
    bucketfolder: str


class Asset:
    assetid: int  # these must match columns from DB table
    userid: int
    assetname: str
    org_bucketkey: str
    new_bucketkey: str
    tracked: str
    public: bool
    org_video_url: str
    new_video_url: str


def users(baseurl):
    try:
        # call the web service:
        api = '/users'
        url = baseurl + api
        res = requests.get(url)

        # check for failure:
        if res.status_code != 200:
            print("Failed with status code:", res.status_code)
            print("url: " + url)
            if res.status_code == 400:  # we'll have an error message
                body = res.json()
                print("Error message:", body["message"])
            return

        # deserialize and extract users:
        body = res.json()
        users = []
        # let's map each dictionary into a User object:
        for row in body["data"]:
            user = jsons.load(row, User)
            users.append(user)

        # print out users:
        for user in users:
            print(user.userid)
            print(" ", user.email)
            print(" ", user.lastname, ",", user.firstname)
            print(" ", user.bucketfolder)

    except Exception as e:
        logging.error("users() failed:")
        logging.error("url: " + url)
        logging.error(e)
        return


def add_user(baseurl, email, last_name, first_name, folder):
    print("client: add_user() called:", baseurl, email, last_name, first_name, folder)

    try:
        # build the data packet:
        data = {
            "email": email,
            "lastname": last_name,
            "firstname": first_name,
            "bucketfolder": folder
        }

        # call the web service:
        api = '/user'
        url = baseurl + api
        res = requests.put(url, json=data)

        # check for failure:
        if res.status_code != 200:
            print("Failed with status code:", res.status_code)
            print("url: " + url)
            if res.status_code == 400:  # we'll have an error message
                body = res.json()
                print("Error message:", body["message"])
            return

        # success, extract userid:
        body = res.json()

        userid = body["userid"]
        message = body["message"]

        print("User", userid, "successfully", message)
        return userid

    except Exception as e:
        logging.error("add_user() failed:")
        logging.error("url: " + url)
        logging.error(e)
        return


def upload_org_video(baseurl, userid, local_filename, isPublic=False):
    userid = str(userid)
    print("client: upload_org_video() called:", baseurl, userid, local_filename)

    if not pathlib.Path(local_filename).is_file():
        print("Local file '", local_filename, "' does not exist...")
        return

    try:
        # build the data packet:
        infile = open(local_filename, "rb")
        video_bytes = infile.read()
        infile.close()

        # now encode the image as base64. Note b64encode returns
        # a bytes object, not a string. So then we have to convert
        # (decode) the bytes -> string, and then we can serialize
        # the string as JSON for upload to server:
        data = base64.b64encode(video_bytes)
        datastr = data.decode()

        # build the data packet:
        data = {"assetname": local_filename, "data": datastr, "isPublic": isPublic}

        # call the web service:
        api = '/upload_org_video'
        url = baseurl + api + "/" + userid
        res = requests.post(url, json=data)

        # check for failure:
        print("------")
        print(res)
        if res.status_code != 200:
            print("Failed with status code:", res.status_code)
            print("url: " + url)
            # if "message" in res.json():
            #     print("Error message:", res.json()["message"])
            
            if res.status_code == 400:  # we'll have an error message
                body = res.json()
                print("Error message:", body["message"])
            return

        # success, extract userid:
        body = res.json()
        print(body)
        # assetid = body["assetid"]
        # print("Video uploaded, asset id =", assetid)
        # for key in body:
        #     print(key, ":", body[key])


    except Exception as e:
        logging.error("upload_org_video() failed:")
        logging.error("url: " + url)
        logging.error(e)
    return


def get_public_videos(baseurl):
    try:
        # call the web service:
        api = '/list_public_videos'
        url = baseurl + api
        res = requests.get(url)

        # check for failure:
        if res.status_code != 200:
            print("Failed with status code:", res.status_code)
            print("url: " + url)
            if res.status_code == 400:  # we'll have an error message
                body = res.json()
                print("Error message:", body["message"])
            return

        # deserialize and extract users:
        body = res.json()
        assets = []
        # let's map each dictionary into a User object:
        for row in body["data"]:
            asset = jsons.load(row, Asset)
            assets.append(asset)

        # print out assets:
        for asset in assets:
            print(asset.assetid)
            print(" ", asset.userid)
            print(" ", asset.assetname)
            print(" ", asset.org_bucketkey)
            print(" ", asset.new_bucketkey)
            print(" ", asset.tracked)
            print(" ", asset.public)
            print(" ", asset.org_video_url)
            print(" ", asset.new_video_url)


    except Exception as e:
        logging.error("assets() failed:")
        logging.error("url: " + url)
        logging.error(e)
        return

def get_user_videos(baseurl, userid):
    try:
        # call the web service:
        api = '/list_user_videos'
        url = baseurl + api + "/" + str(userid)
        res = requests.get(url)

        # check for failure:
        if res.status_code != 200:
            print("Failed with status code:", res.status_code)
            print("url: " + url)
            if res.status_code == 400:  # we'll have an error message
                body = res.json()
                print("Error message:", body["message"])
            return

        # deserialize and extract users:
        body = res.json()
        assets = []
        # let's map each dictionary into a User object:
        for row in body["data"]:
            asset = jsons.load(row, Asset)
            assets.append(asset)

        # print out assets:
        for asset in assets:
            print(asset.assetid)
            print(" ", asset.userid)
            print(" ", asset.assetname)
            print(" ", asset.org_bucketkey)
            print(" ", asset.new_bucketkey)
            print(" ", asset.tracked)
            print(" ", asset.public)
            print(" ", asset.org_video_url)
            print(" ", asset.new_video_url)


    except Exception as e:
        logging.error("assets() failed:")
        logging.error("url: " + url)
        logging.error(e)
        return


def get_urls(baseurl, userid, asserid):
    try:
        # call the web service:
        url = baseurl + "/get_urls" + "/" + str(userid) + "/" + str(asserid)
        res = requests.get(url)

        # check for failure:
        if res.status_code != 200:
            print("Failed with status code:", res.status_code)
            print("url: " + url)
            if res.status_code == 400:  # we'll have an error message
                body = res.json()
                print("Error message:", body["message"])
            return

        # deserialize and extract users:
        body = res.json()
        print(body["message"])
        print(body["userid"])
        print(body["assetname"])
        print(body["tracked"])
        print(body["org_video_url"])
        print(body["new_video_url"])


    except Exception as e:
        logging.error("assets() failed:")
        logging.error("url: " + url)
        logging.error(e)
        return

def upload_new_video(baseurl, assetid, local_filename):
    assetid = str(assetid)
    print("client: upload_new_video() called:", baseurl, assetid, local_filename)

    if not pathlib.Path(local_filename).is_file():
        print("Local file '", local_filename, "' does not exist...")
        return

    try:
        # build the data packet:
        infile = open(local_filename, "rb")
        video_bytes = infile.read()
        infile.close()

        # now encode the image as base64. Note b64encode returns
        # a bytes object, not a string. So then we have to convert
        # (decode) the bytes -> string, and then we can serialize
        # the string as JSON for upload to server:
        datastr = base64.b64encode(video_bytes).decode()

        # build the data packet:
        data = {"data": datastr}

        # call the web service:
        api = '/upload_new_video'
        url = baseurl + api + "/" + assetid
        res = requests.post(url, json=data)

        # check for failure:
        if res.status_code != 200:
            print("Failed with status code:", res.status_code)
            print("url: " + url)
            if res.status_code == 400:  # we'll have an error message
                body = res.json()
                print("Error message:", body["message"])
            return

        # success, extract userid:
        body = res.json()
        print("Video uploaded, asset id =", assetid)
        for key in body:
            print(key, ":", body[key])

    except Exception as e:
        logging.error("upload_new_video() failed:")
        logging.error("url: " + url)
        logging.error(e)
    return

def delete_record(baseurl, userid, assetid, trackedOnly=False):
    try:
        # call the web service:
        if trackedOnly:
            api = '/delete_tracked'
        else:
            api = '/delete_all'
        url = baseurl + api + "/" + str(userid) + "/" + str(assetid)
        res = requests.delete(url)

        # check for failure:
        if res.status_code != 200:
            print("Failed with status code:", res.status_code)
            print("url: " + url)
            if res.status_code == 400:  # we'll have an error message
                body = res.json()
                print("Error message:", body["message"])
            return

        # deserialize and extract users:
        body = res.json()
        print(body["message"])

    except Exception as e:
        logging.error("assets() failed:")
        logging.error("url: " + url)
        logging.error(e)
        return
    
def change_public(baseurl, userid, assetid, newPublic):
    try:
        # call the web service:
        api = '/change_visibility'
        url = baseurl + api + "/" + str(userid) + "/" + str(assetid) + "/" + str(newPublic)
        res = requests.put(url)

        # check for failure:
        if res.status_code != 200:
            print("Failed with status code:", res.status_code)
            print("url: " + url)
            if res.status_code == 400:  # we'll have an error message
                body = res.json()
                print("Error message:", body["message"])
            return

        # deserialize and extract users:
        body = res.json()
        print(body["message"])

    except Exception as e:
        logging.error("assets() failed:")
        logging.error("url: " + url)
        logging.error(e)
        return
    
# get_public_videos(baseurl)
get_user_videos(baseurl, 80001)
# users(baseurl)
exit(0)

# print('------------------')
# get_user_videos(baseurl, 80004)
# print('------------------')
# delete_record(baseurl, 80004, 1008, True)
print('------------------ should false, but does not care')
get_user_videos(baseurl, 80004)

print('------------------')
change_public(baseurl, 80004, 1014, True)

print('------------------, should true')
get_user_videos(baseurl, 80004)

print('------------------ should fail')
change_public(baseurl, 80003, 1014, False)

print('------------------, should true')
get_user_videos(baseurl, 80004)

print('------------------')
change_public(baseurl, 80004, 1014, False)

print('------------------, should false')
get_user_videos(baseurl, 80004)

print('------------------')
change_public(baseurl, 80004, 1014, 1)

# upload_org_video(baseurl, 80004, "example.mp4", False)
# exit(0)
# email = str(uuid.uuid4())[:5] + "@" + str(uuid.uuid4())[:5] + ".com"
# last_name = str(uuid.uuid4())[:5]
# first_name = str(uuid.uuid4())[:5]
# folder = str(uuid.uuid4())

# userid = add_user(baseurl, email, last_name, first_name, folder)
# users(baseurl)


# print("--------------------", 1)
# upload_org_video(baseurl, userid, "example.mp4", False)
# print("--------------------", 2)
# upload_org_video(baseurl, userid, "example.mp4", False)
# print("--------------------", 3)
# upload_org_video(baseurl, userid, "example.mp4", True)
# print("--------------------", 4)
# get_user_videos(baseurl, userid)

# email = str(uuid.uuid4())[:5] + "@" + str(uuid.uuid4())[:5] + ".com"
# last_name = str(uuid.uuid4())[:5]
# first_name = str(uuid.uuid4())[:5]
# folder = str(uuid.uuid4())
# userid = add_user(baseurl, email, last_name, first_name, folder)
# users(baseurl)
# userid0 = userid

# print("--------------------", 5)
# upload_org_video(baseurl, userid, "example.mp4", False)
# print("--------------------", 6)
# upload_org_video(baseurl, userid, "example.mp4", True)
# print("--------------------", 7)
# upload_org_video(baseurl, userid, "example.mp4", True)
# print("--------------------", 8)
# get_user_videos(baseurl, userid)


# users(baseurl)
# get_user_videos(baseurl, 80001)
# print("--------------------", "should succeed")
# get_urls(baseurl, 80001, 1002)
# print("--------------------", "should fail")
# get_urls(baseurl, 80002, 1002)
# print("--------------------", "should succeed")
# get_urls(baseurl, 80002, 1003)

# users(baseurl)
# get_user_videos(baseurl, 80009)
# upload_new_video(baseurl, 1002, "tracked.mp4")
