import { REQUEST_URL } from "../constants";
import { IFile } from "../types";

export const uploadVideo: (
    file: IFile[],
    setFile: (file: IFile[]) => void,
    newFile: IFile
) => void = async (file, setFile, newFile) => {
    const requestOptions = {
        method: "POST",
        headers: {
            accept: "application/json",
        },
    };
    setFile([newFile, ...file]);
};

export const getVideos: (
    file: IFile[],
    setFile: (file: IFile[]) => void
) => void = async (file, setFile) => {
    const requestOptions = {
        method: "GET",
        headers: {
            accept: "application/json",
        },
    };
    console.log("GET REQUEST:", REQUEST_URL);
    await fetch(REQUEST_URL, requestOptions)
        .then((response) => response.json())
        .then((data: IFile[]) => {
            setFile([...data, ...file]);
        });
};
