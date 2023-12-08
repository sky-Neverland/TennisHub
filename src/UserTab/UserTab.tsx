import React, { useState, useEffect, useContext } from "react";
import { Flex, Text, Box, LoadingOverlay } from "@mantine/core";
import { ModelCard, HeaderSearch, Dropzone, Grid } from "../Components";
import { uploadVideo, getUserVideos } from "../utils";
import { IUploadRequest, UploadState, TrackState } from "../types";
import { IconAlertTriangle, IconVideoOff } from "@tabler/icons-react";
import { TabContext } from "../TabContext";
interface PrivateTabProps {
    userid?: string;
}
const UserTab = ({ userid }: PrivateTabProps) => {
    const [value, setValue] = useState<string>("");
    const {
        userFiles: files,
        setUserFiles: setFiles,
        setPublicFiles,
    } = useContext(TabContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [uploadState, setUploadState] = useState<UploadState>(
        UploadState.IDLE
    );
    const onDrop = (newFile: IUploadRequest) => {
        setUploadState(UploadState.IDLE);
        userid &&
            uploadVideo(
                setPublicFiles,
                setFiles,
                setLoading,
                setUploadState,
                newFile,
                userid
            );
    };
    useEffect(() => {
        setFiles([]);
        userid && getUserVideos(userid, setFiles, setLoading);
    }, [userid]);

    return (
        <div>
            <HeaderSearch setValue={setValue} data={files} />
            <Dropzone
                onDrop={onDrop}
                loading={loading}
                disabled={!!!userid}
                uploadState={uploadState}
            />
            <Box>
                <LoadingOverlay visible={loading} />
                {!userid && (
                    <Flex align="center" m="md">
                        <IconAlertTriangle size={20} color="red" />
                        <Text color="red" size={20} ml="md">
                            Please select a user
                        </Text>
                    </Flex>
                )}
                {!loading && userid && files.length === 0 && (
                    <Flex align="center" m="md">
                        <IconVideoOff size={20} color="orange" />
                        <Text color="orange" size={20} ml="md">
                            No videos found. Please upload a video.
                        </Text>
                    </Flex>
                )}
                <Grid>
                    {files.map((file) => {
                        return (
                            <ModelCard
                                edit
                                src={file.org_video_url}
                                newSrc={file.new_video_url}
                                key={file.assetid}
                                title={file.assetname}
                                display={file.assetname.includes(value)}
                                track={file.tracked}
                                assetid={file.assetid}
                                userid={file.userid}
                                isPublic={file.public}
                            />
                        );
                    })}
                </Grid>
            </Box>
        </div>
    );
};

export default UserTab;
