export enum TrackState {
    UNTRACKED = "untracked",
    PENDING = "pending",
    DONE = "tracked",
    FAILED = "failed",
}

export interface IFile {
    assetid: string;
    userid: string;
    assetname: string;
    tracked: TrackState;
    public: boolean;
    org_video_url: string;
    new_video_url: string;
}

export interface IUser {
    userid: string;
    email: string;
    lastname: string;
    firstname: string;
    bucketfolder: string;
}

export interface IUserResponse {
    message: string;
    data: IUser[];
}

export interface IFileResponse {
    message: string;
    data: IFile[];
}

export interface IUploadRequest {
    assetname: string;
    data: string;
    isPublic: boolean;
}

export enum RDS_API {
    LIST_PUBLIC_VIDEOS = "/list_public_videos",
    LIST_USER_VIDEOS = "/list_user_videos",
    GET_USERS = "/users",
    UPLOAD_VIDEO = "/upload_org_video",
    DELETE_VIDEO = "/delete_all",
    CHANGE_VISIBILITY = "/change_visibility",
}

export enum UploadState {
    IDLE = "idle",
    DONE = "done",
    FAILED = "failed",
}