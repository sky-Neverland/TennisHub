import React, { FC } from "react";
import { ActionIcon } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { deleteVideo } from "../utils";
import { IFile } from "../types";

export interface DeleteButtonProps {
    setFiles: React.Dispatch<React.SetStateAction<IFile[]>>;
    assetid: string;
    userid: string;
}
const DeleteButton: FC<DeleteButtonProps> = ({ setFiles, assetid, userid }) => (
    <ActionIcon
        size="sm"
        title="Delete"
        variant="subtle"
        color="gray"
        onClick={() => deleteVideo(setFiles, assetid, userid)}
    >
        <IconTrash size={12} />
    </ActionIcon>
);

export default DeleteButton;
