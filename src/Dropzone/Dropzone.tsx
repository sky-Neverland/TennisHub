import React, { useRef, useState, FC } from "react";
import classnames from "classnames";
import { Text, Group, createStyles, rem } from "@mantine/core";
import { Dropzone as Drop, MIME_TYPES, FileWithPath } from "@mantine/dropzone";
import {
    IconCloudUpload,
    IconX,
    IconDownload,
    IconUserOff,
} from "@tabler/icons-react";
import Preview from "./Preview/Preview";
import { IUploadRequest, UploadState } from "../types";

const MAX_SIZE = 8; // File size in MB
const useStyles = createStyles((theme) => ({
    dropzone: {
        borderWidth: rem(1),
        paddingBottom: rem(50),
    },
    disabled: {
        opacity: 0.5,
        cursor: "not-allowed",
    },

    icon: {
        color:
            theme.colorScheme === "dark"
                ? theme.colors.dark[3]
                : theme.colors.gray[4],
    },
}));

const toBase64: (file: File) => Promise<string> = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result?.toString() || "");
        reader.onerror = reject;
    });

const Dropzone: FC<{
    onDrop: (q: IUploadRequest) => void;
    loading?: boolean;
    disabled?: boolean;
    uploadState?: string;
}> = ({ onDrop, loading, disabled, uploadState }) => {
    const { classes, theme } = useStyles();
    const openRef = useRef<() => void>(null);
    const [files, setFiles] = useState<FileWithPath[]>([]);

    const onDropVideo = async (files: FileWithPath[]) => {
        try {
            setFiles(files);
            const newFile = files[files.length - 1];
            const data = await toBase64(newFile);
            onDrop({
                assetname: newFile.name,
                isPublic: false,
                data: data.replace("data:video/mp4;base64,", ""),
            });
        } catch (e) {
            console.log(e);
        }
    };
    return (
        <Drop
            disabled={disabled}
            loading={loading}
            openRef={openRef}
            onDrop={onDropVideo}
            className={classnames(
                classes.dropzone,
                disabled && classes.disabled
            )}
            radius="md"
            accept={[MIME_TYPES.mp4]}
            maxSize={MAX_SIZE * 1024 ** 2}
        >
            <div style={{ pointerEvents: "none" }}>
                <Group position="center">
                    <Drop.Reject>
                        <IconX
                            size={rem(50)}
                            color={theme.colors.red[6]}
                            stroke={1.5}
                        />
                    </Drop.Reject>
                    <Drop.Idle>
                        {files.length > 0 ? (
                            files.map((file, idx) => (
                                <Preview
                                    key={idx.toString()}
                                    src={URL.createObjectURL(file)}
                                />
                            ))
                        ) : (
                            <>
                                {disabled && (
                                    <IconUserOff
                                        size={rem(50)}
                                        color={
                                            theme.colorScheme === "dark"
                                                ? theme.colors.dark[0]
                                                : theme.black
                                        }
                                        stroke={1.5}
                                    />
                                )}
                                {!disabled && (
                                    <IconCloudUpload
                                        size={rem(50)}
                                        color={
                                            theme.colorScheme === "dark"
                                                ? theme.colors.dark[0]
                                                : theme.black
                                        }
                                        stroke={1.5}
                                    />
                                )}
                            </>
                        )}
                    </Drop.Idle>
                    <Drop.Accept>
                        <IconDownload
                            size={rem(50)}
                            color={theme.colors[theme.primaryColor][6]}
                            stroke={1.5}
                        />
                    </Drop.Accept>
                </Group>

                <Text ta="center" fw={700} fz="lg" mt="xl">
                    <Drop.Accept>Drop files here</Drop.Accept>
                    <Drop.Reject>File less than {MAX_SIZE}MB</Drop.Reject>
                    <Drop.Idle>
                        {disabled ? "User not selected" : "Upload video"}
                    </Drop.Idle>
                </Text>
                <Text ta="center" fz="sm" mt="xs" c="dimmed">
                    {disabled
                        ? "Select a user to upload video"
                        : "Upload a video in mp4 format"}
                </Text>
                {uploadState !== UploadState.IDLE && (
                    <>
                        {uploadState === UploadState.FAILED && (
                            <Text
                                ta="center"
                                fw={700}
                                fz="lg"
                                mt="xl"
                                color="red"
                            >
                                Upload Failed
                            </Text>
                        )}
                        {uploadState === UploadState.DONE && (
                            <Text
                                ta="center"
                                fw={700}
                                fz="lg"
                                mt="xl"
                                color="green"
                            >
                                Uploaded
                            </Text>
                        )}
                    </>
                )}
            </div>
        </Drop>
    );
};

export default Dropzone;
