import { RDS_URL } from "./constants";
import {
    IFile,
    IFileResponse,
    IUploadRequest,
    IUser,
    IUserResponse,
    RDS_API,
    UploadState,
    TrackState,
} from "./types";

export const uploadVideo: (
    setPublicFiles: React.Dispatch<React.SetStateAction<IFile[]>>,
    setUserFiles: React.Dispatch<React.SetStateAction<IFile[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setUploadState: React.Dispatch<React.SetStateAction<UploadState>>,
    newFile: IUploadRequest,
    userid: string
) => void = async (
    setPublicFiles,
    setUserFiles,
    setLoading,
    setUploadState,
    newFile,
    userid
) => {
        const requestOptions: RequestInit = {
            method: "POST",
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newFile),
        };
        try {
            setLoading(true);
            await fetch(
                RDS_URL + RDS_API.UPLOAD_VIDEO + "/" + userid,
                requestOptions
            ).then((response) => {
                if (response.status === 200)
                    response.json().then(({ data }: IFileResponse) => {
                        data &&
                            newFile.isPublic &&
                            setPublicFiles((files) => files && [...data, ...files]);
                        data && setUserFiles((files) => [...data, ...files]);
                        setLoading(false);
                        setUploadState(UploadState.DONE);
                    });
                else throw new Error("Upload Failed");
            });
        } catch (e) {
            console.log(e);
            setLoading(false);
            setUploadState(UploadState.FAILED);
        }
    };

export const getPulicVideos: (
    setFiles: React.Dispatch<React.SetStateAction<IFile[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => void = async (setFiles, setLoading) => {
    const requestOptions: RequestInit = {
        method: "GET",
        headers: {
            accept: "application/json",
        },
    };
    setLoading(true);
    try {
        await fetch(RDS_URL + RDS_API.LIST_PUBLIC_VIDEOS, requestOptions).then(
            (response) => {
                if (response.status === 200)
                    response.json().then(({ data }: IFileResponse) => {
                        data &&
                            setFiles((files) => files && [...data, ...files]);
                        setLoading(false);
                    });
                else throw new Error("Get Public Videos Failed");
            }
        );
    } catch (e) {
        console.log(e);
        setLoading(false);
    }
};

export const getUsers: (
    setUsers: React.Dispatch<React.SetStateAction<IUser[]>>
) => void = async (setUsers) => {
    const requestOptions: RequestInit = {
        method: "GET",
        headers: {
            accept: "application/json",
        },
    };
    try {
        await fetch(RDS_URL + RDS_API.GET_USERS, requestOptions).then(
            (response) => {
                if (response.status === 200)
                    response.json().then(({ data }: IUserResponse) => {
                        data && setUsers((user) => user && [...data, ...user]);
                    });
                else throw new Error("Get Users Failed");
            }
        );
    } catch (e) {
        console.log(e);
    }
};

export const getUserVideos: (
    userid: string,
    setFiles: React.Dispatch<React.SetStateAction<IFile[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => void = async (userid, setFiles, setLoading) => {
    const requestOptions: RequestInit = {
        method: "GET",
        headers: {
            accept: "application/json",
        },
    };
    setLoading(true);
    try {
        await fetch(
            RDS_URL + RDS_API.LIST_USER_VIDEOS + "/" + userid,
            requestOptions
        ).then((response) => {
            if (response.status === 200)
                response.json().then(({ data }: IFileResponse) => {
                    data && setFiles((files) => files && [...data, ...files]);
                    setLoading(false);
                });
            else throw new Error("Get User Videos Failed");
        });
    } catch (e) {
        console.log(e);
        setLoading(false);
    }
};

export const deleteVideo: (
    setPublicFiles: React.Dispatch<React.SetStateAction<IFile[]>>,
    setUserFiles: React.Dispatch<React.SetStateAction<IFile[]>>,
    userFiles: IFile[],
    assetid: string,
    userid: string
) => void = async (setPublicFiles, setUserFiles, userFiles, assetid, userid) => {
    const requestOptions: RequestInit = {
        method: "DELETE",
        headers: {
            accept: "application/json",
        },
    };
    try {
        await fetch(
            RDS_URL + RDS_API.DELETE_VIDEO + "/" + userid + "/" + assetid,
            requestOptions
        ).then((response) => {
            if (response.status === 200) {
                const fileDeleted = userFiles.find((f) => f.assetid === assetid);
                if (fileDeleted?.public)
                    setPublicFiles((files) =>
                        files.filter((f) => f.assetid !== assetid)
                    );
                setUserFiles((files) => files.filter((f) => f.assetid !== assetid));
            } else throw new Error("Delete Video Failed");
        });
    } catch (e) {
        console.log(e);
    }
};

export const changeVisibility: (
    setPublicFiles: React.Dispatch<React.SetStateAction<IFile[]>>,
    setUserFiles: React.Dispatch<React.SetStateAction<IFile[]>>,
    userFiles: IFile[],
    assetid: string,
    userid: string,
    isPublic?: boolean
) => void = async (
    setPublicFiles,
    setUserFiles,
    userFiles,
    assetid,
    userid,
    isPublic
) => {
        const requestOptions: RequestInit = {
            method: "PUT",
            headers: {
                accept: "application/json",
            },
            body: JSON.stringify({ isPublic: !!isPublic }),
        };
        try {
            await fetch(
                RDS_URL +
                RDS_API.CHANGE_VISIBILITY +
                "/" +
                userid +
                "/" +
                assetid +
                "/" +
                (!!!isPublic).toString(),
                requestOptions
            ).then((response) => {
                if (response.status === 200) {
                    const fileChanged = userFiles.find(
                        (f) => f.assetid === assetid
                    );
                    if (fileChanged) {
                        if (fileChanged.public)
                            setPublicFiles((files) =>
                                files.filter((f) => f.assetid !== assetid)
                            );
                        else
                            setPublicFiles((files) => [
                                ...files,
                                { ...fileChanged, public: !fileChanged.public },
                            ]);

                        setUserFiles((files) =>
                            files.map((f) =>
                                f.assetid === assetid
                                    ? { ...f, public: !f.public }
                                    : f
                            )
                        );
                    } else {
                        throw new Error("Change invalid");
                    }
                } else throw new Error("Change Visibility Failed");
            });
        } catch (e) {
            console.log(e);
        }
    };

export const trackVideo: (
    setPublicFiles: React.Dispatch<React.SetStateAction<IFile[]>>,
    setUserFiles: React.Dispatch<React.SetStateAction<IFile[]>>,
    userid: string,
    assetid: string,
    setShowTrack: React.Dispatch<React.SetStateAction<boolean>>
) => void = async (
    setPublicFiles,
    setUserFiles,
    userid,
    assetid,
    setShowTrack
) => {
        const requestOptions: RequestInit = {
            method: "GET",
            headers: {
                accept: "application/json",
            },
        };
        try {
            setPublicFiles((files) =>
                files.map((f) =>
                    f.assetid === assetid
                        ? { ...f, tracked: TrackState.PENDING }
                        : f
                )
            );
            setUserFiles((files) =>
                files.map((f) =>
                    f.assetid === assetid
                        ? { ...f, tracked: TrackState.PENDING }
                        : f
                )
            );
            await fetch(
                RDS_URL + RDS_API.TRACK_VIDEO + "/" + userid + "/" + assetid,
                requestOptions
            ).then((response) => {
                if (response.status === 200)
                    response.json().then(({ data }: IFileResponse) => {
                        data &&
                            setPublicFiles((files) =>
                                files.map((f) =>
                                    f.assetid === assetid
                                        ? { ...f, tracked: TrackState.DONE, new_video_url: data[0].new_video_url }
                                        : f
                                )
                            );
                        data &&
                            setUserFiles((files) =>
                                files.map((f) =>
                                    f.assetid === assetid
                                        ? { ...f, tracked: TrackState.DONE, new_video_url: data[0].new_video_url }
                                        : f
                                )
                            );
                        setShowTrack(true);
                    });
                else throw new Error("Track Failed");
            });
        } catch (e) {
            console.log(e);
            setPublicFiles((files) =>
                files.map((f) =>
                    f.assetid === assetid ? { ...f, tracked: TrackState.FAILED } : f
                )
            );
            setUserFiles((files) =>
                files.map((f) =>
                    f.assetid === assetid ? { ...f, tracked: TrackState.FAILED } : f
                )
            );
            setShowTrack(false);
        }
    };
