import { RDS_URL } from "./constants";
import {
    IFile,
    IFileResponse,
    IUploadRequest,
    IUser,
    IUserResponse,
    RDS_API,
    UploadState,
} from "./types";

export const uploadVideo: (
    setFile: React.Dispatch<React.SetStateAction<IFile[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setUploadState: React.Dispatch<React.SetStateAction<UploadState>>,
    newFile: IUploadRequest,
    userId: string
) => void = async (setFile, setLoading, setUploadState, newFile, userId) => {
    const requestOptions: RequestInit = {
        method: "POST",
        headers: {
            accept: "application/json",
        },
        body: JSON.stringify(newFile),
    };
    try {
        setLoading(true);
        await fetch(
            RDS_URL + RDS_API.UPLOAD_VIDEO + "/" + userId,
            requestOptions
        ).then((response) => {
            if (response.status === 200)
                response.json().then(({ data }: IFileResponse) => {
                    data && setFile((file) => file && [...data, ...file]);
                    setLoading(false);
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
    setFile: React.Dispatch<React.SetStateAction<IFile[]>>
) => void = async (setFile) => {
    const requestOptions: RequestInit = {
        method: "GET",
        headers: {
            accept: "application/json",
        },
    };
    try {
        await fetch(RDS_URL + RDS_API.LIST_PUBLIC_VIDEOS, requestOptions).then(
            (response) => {
                if (response.status === 200)
                    response.json().then(({ data }: IFileResponse) => {
                        data && setFile((file) => file && [...data, ...file]);
                    });
                else throw new Error("Get Public Videos Failed");
            }
        );
    } catch (e) {
        console.log(e);
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
    userId: string,
    setFile: React.Dispatch<React.SetStateAction<IFile[]>>
) => void = async (userId, setFile) => {
    const requestOptions: RequestInit = {
        method: "GET",
        headers: {
            accept: "application/json",
        },
    };
    try {
        await fetch(
            RDS_URL + RDS_API.LIST_USER_VIDEOS + "/" + userId,
            requestOptions
        ).then((response) => {
            if (response.status === 200)
                response.json().then(({ data }: IFileResponse) => {
                    data && setFile((file) => file && [...data, ...file]);
                });
            else throw new Error("Get User Videos Failed");
        });
    } catch (e) {
        console.log(e);
    }
};
