import React, { useState, useEffect } from "react";
import { Text } from "@mantine/core";
import ModelCard from "../ModelCard/ModelCard";
import HeaderSearch from "../HeaderSearch/HeaderSearch";
import Dropzone from "../Dropzone/Dropzone";
import Grid from "../Grid/Grid";
import { uploadVideo, getUserVideos } from "../utils";
import { IFile, IUploadRequest, UploadState, TrackState } from "../types";
import DeleteButton from "../DeleteButton";

interface PrivateTabProps {
    userId?: string;
}
const UserTab = ({ userId }: PrivateTabProps) => {
    const [value, setValue] = useState("");
    const [file, setFile] = useState<IFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploadState, setUploadState] = useState(UploadState.IDLE);
    const onDrop = (newFile: IUploadRequest) => {
        setUploadState(UploadState.IDLE);
        userId &&
            uploadVideo(setFile, setLoading, setUploadState, newFile, userId);
    };
    useEffect(() => {
        setFile([]);
        userId && getUserVideos(userId, setFile);
    }, [userId]);

    return (
        <div>
            <HeaderSearch setValue={setValue} data={file} />
            <Dropzone
                onDrop={onDrop}
                loading={loading}
                disabled={!!!userId}
                uploadState={uploadState}
            />
            <Grid>
                {!userId && (
                    <Text color="red" size={20}>
                        Please select a user
                    </Text>
                )}
                {userId && file.length === 0 && (
                    <Text size={20}>
                        No videos found. Please upload a video.
                    </Text>
                )}
                {file.map((file) => {
                    return (
                        <ModelCard
                            key={file.assetid}
                            title={file.assetname}
                            display={file.assetname.includes(value)}
                            rating={file.tracked}
                            deleteButton={
                                <DeleteButton
                                    setFile={setFile}
                                    assetid={file.assetid}
                                    userid={file.userid}
                                />
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

export default UserTab;
