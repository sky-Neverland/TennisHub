import React, { FC } from "react";
import { Button } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { deleteVideo } from "./utils";
import { IFile } from "./types";

interface DeleteButtonProps {
    setFile: React.Dispatch<React.SetStateAction<IFile[]>>;
    assetid: string;
    userid: string;
}
const DeleteButton: FC<DeleteButtonProps> = ({ setFile, assetid, userid }) => (
    <Button
        h="12px"
        title="Delete"
        variant="transparent"
        rightIcon={<IconTrash size={12} />}
        onClick={() => deleteVideo(setFile, assetid, userid)}
    />
);

export default DeleteButton;
