import React, { useState, useEffect } from "react";
import { Text } from "@mantine/core";
import ModelCard from "../ModelCard/ModelCard";
import HeaderSearch from "../HeaderSearch/HeaderSearch";
import Dropzone from "../Dropzone/Dropzone";
import Grid from "../Grid/Grid";
import { uploadVideo, getUserVideos } from "../utils";
import { IFile, IUploadRequest, UploadState } from "../types";

interface PrivateTabProps {
    userId?: string;
}
const PrivateTab = ({ userId }: PrivateTabProps) => {
    const [value, setValue] = useState("");
    const [file, setFile] = useState<IFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploadState, setUploadState] = useState(UploadState.IDLE);
    const onDrop = (newFile: IUploadRequest) =>
        userId &&
        uploadVideo(setFile, setLoading, setUploadState, newFile, userId);

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
                    <Text color="red" size={20}>
                        No videos found
                    </Text>
                )}
                {file.map((file) => {
                    return (
                        <ModelCard
                            key={file.assetid}
                            title={file.assetname}
                            display={file.assetname.includes(value)}
                        >
                            <iframe
                                src={file.org_video_url}
                                title="YouTube video player"
                                style={{ border: 0 }}
                                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </ModelCard>
                    );
                })}
            </Grid>
        </div>
    );
};

export default PrivateTab;
