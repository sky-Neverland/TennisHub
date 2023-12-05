import React, { useRef, useState, FC } from "react";
import { Text, Group, createStyles, rem } from "@mantine/core";
import { Dropzone as Drop, MIME_TYPES, FileWithPath } from "@mantine/dropzone";
import { IconCloudUpload, IconX, IconDownload } from "@tabler/icons-react";
import Preview from "./Preview/Preview";
import { IFile } from "../types";

const MAX_SIZE = 8; // File size in MB
const useStyles = createStyles((theme) => ({
    dropzone: {
        borderWidth: rem(1),
        paddingBottom: rem(50),
    },

    icon: {
        color:
            theme.colorScheme === "dark"
                ? theme.colors.dark[3]
                : theme.colors.gray[4],
    },
}));

const Dropzone: FC<{ onDrop: (q: IFile) => void }> = ({ onDrop }) => {
    const { classes, theme } = useStyles();
    const openRef = useRef<() => void>(null);
    const [files, setFiles] = useState<FileWithPath[]>([]);

    const onDropVideo = (files: FileWithPath[]) => {
        setFiles(files);
        const newFile = files[files.length - 1];
        onDrop({
            name: newFile.name,
            src: URL.createObjectURL(newFile) || "",
        });
    };

    return (
        <Drop
            openRef={openRef}
            onDrop={onDropVideo}
            className={classes.dropzone}
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
                    <Drop.Idle>Upload video</Drop.Idle>
                </Text>
                <Text ta="center" fz="sm" mt="xs" c="dimmed">
                    Upload a video in mp4 format
                </Text>
            </div>
        </Drop>
    );
};

export default Dropzone;
