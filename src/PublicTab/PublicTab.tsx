import React, { useState, useEffect, useRef } from "react";
import ModelCard from "../ModelCard/ModelCard";
import HeaderSearch from "../HeaderSearch/HeaderSearch";
import Grid from "../Grid/Grid";
import Dropzone from "../Dropzone/Dropzone";
import { getPulicVideos, uploadVideo } from "../utils";
import { IFile, IUser, TrackState, UploadState, IUploadRequest } from "../types";
import DeleteButton from "../DeleteButton";

interface PulicTabProps {
    users: IUser[];
    userId: string;
}
const PublicTab = ({ users, userId }: PulicTabProps) => {
    const [value, setValue] = useState("");
    const [file, setFile] = useState<IFile[]>([]);
    const renderRef = useRef(true);
    const [loading, setLoading] = useState(false);
    const [uploadState, setUploadState] = useState(UploadState.IDLE);
    const onDrop = (newFile: IUploadRequest) => {
        setUploadState(UploadState.IDLE);
        userId &&
            uploadVideo(setFile, setLoading, setUploadState, newFile, userId);
    };
    useEffect(() => {
        if (renderRef.current) getPulicVideos(setFile);
        return () => {
            renderRef.current = false;
        };
    }, []);

    return (
        <div>
            <HeaderSearch setValue={setValue} data={file} />
            <Dropzone
                onDrop={onDrop}
                loading={loading}
                disabled={!!!userId}
                uploadState={uploadState}
                isPublic={true}
            />
            <Grid>
                {file.map((file) => {
                    const user = users.find(
                        (user) => user.userid === file.userid
                    );
                    return (
                        <ModelCard
                            key={file.assetid}
                            title={file.assetname}
                            display={file.assetname.includes(value)}
                            rating={file.tracked}
                            author={user?.lastname + " " + user?.firstname}
                            deleteButton={
                                file.userid === userId && (
                                    <DeleteButton
                                        setFile={setFile}
                                        assetid={file.assetid}
                                        userid={userId}
                                    />
                                )
                            }
                        >
                            <iframe
                                src={file.org_video_url}
                                title="YouTube video player"
                                style={{ border: 0 }}
                                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                loading="lazy"
                            ></iframe>

                            {file.tracked === TrackState.DONE && (
                                <iframe
                                    src={file.new_video_url}
                                    title="YouTube video player"
                                    style={{ border: 0 }}
                                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    loading="lazy"
                                ></iframe>
                            )}
                        </ModelCard>
                    );
                })}
            </Grid>
        </div>
    );
};

export default PublicTab;
