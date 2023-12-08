import React, { FC, useContext } from "react";
import { ActionIcon } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { deleteVideo } from "../utils";
import { IFile } from "../types";
import { TabContext } from "../TabContext";

export interface DeleteButtonProps {
    assetid: string;
    userid: string;
}
const DeleteButton: FC<DeleteButtonProps> = ({ assetid, userid }) => {
    const { setPublicFiles, setUserFiles, userFiles } = useContext(TabContext);
    return (
        <ActionIcon
            size="sm"
            title="Delete"
            variant="subtle"
            color="gray"
            onClick={() =>
                deleteVideo(
                    setPublicFiles,
                    setUserFiles,
                    userFiles,
                    assetid,
                    userid
                )
            }
        >
            <IconTrash size={12} />
        </ActionIcon>
    );
};

export default DeleteButton;
