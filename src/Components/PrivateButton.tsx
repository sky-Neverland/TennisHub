import React, { FC } from "react";
import { Button, Text } from "@mantine/core";
import { IconEyeCheck, IconEyeOff } from "@tabler/icons-react";
import { changeVisibility } from "../utils";
import { IFile } from "../types";

export interface PrivateButtonProps {
    setFiles: React.Dispatch<React.SetStateAction<IFile[]>>;
    assetid: string;
    userid: string;
    isPublic?: boolean;
    isPublicPage?: boolean;
}
const PrivateButton: FC<PrivateButtonProps> = ({
    setFiles,
    assetid,
    userid,
    isPublic,
    isPublicPage,
}) => (
    <Button
        color="gray"
        size="compact-xs"
        title={isPublic ? "Hide" : "Publish"}
        variant="subtle"
        rightIcon={
            isPublic ? <IconEyeOff size={12} /> : <IconEyeCheck size={12} />
        }
        onClick={() => changeVisibility(setFiles, assetid, userid, isPublic, isPublicPage)}
    >
        <Text h="12px" size="12px" lh="1">
            {isPublic ? "Hide" : "Publish"}
        </Text>
    </Button>
);

export default PrivateButton;
