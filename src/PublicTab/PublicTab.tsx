import React, { useState, useEffect, useRef } from "react";
import { ModelCard, HeaderSearch, Grid, Dropzone } from "../Components";
import { getPulicVideos, uploadVideo } from "../utils";
import { IFile, IUser, UploadState, IUploadRequest } from "../types";
interface PulicTabProps {
    users: IUser[];
    userid: string;
}
const PublicTab = ({ users, userid }: PulicTabProps) => {
    const [value, setValue] = useState<string>("");
    const [files, setFiles] = useState<IFile[]>([]);
    const renderRef = useRef(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [uploadState, setUploadState] = useState<UploadState>(
        UploadState.IDLE
    );
    const onDrop = (newFile: IUploadRequest) => {
        setUploadState(UploadState.IDLE);
        userid &&
            uploadVideo(setFiles, setLoading, setUploadState, newFile, userid);
    };
    useEffect(() => {
        if (renderRef.current) getPulicVideos(setFiles, setLoading);
        return () => {
            renderRef.current = false;
        };
    }, []);

    return (
        <div>
            <HeaderSearch setValue={setValue} data={files} />
            <Dropzone
                onDrop={onDrop}
                loading={loading}
                disabled={!!!userid}
                uploadState={uploadState}
                isPublic={true}
            />
            <Grid>
                {files.map((file) => {
                    const user = users.find(
                        (user) => user.userid === file.userid
                    );
                    return (
                        <ModelCard
                            isPublicPage
                            src={file.org_video_url}
                            newSrc={file.new_video_url}
                            key={file.assetid}
                            title={file.assetname}
                            display={file.assetname.includes(value)}
                            track={file.tracked}
                            author={user?.lastname + " " + user?.firstname}
                            isPublic
                            setFiles={setFiles}
                            assetid={file.assetid}
                            userid={file.userid}
                        />
                    );
                })}
            </Grid>
        </div>
    );
};

export default PublicTab;
