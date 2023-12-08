import React, { FC, useContext } from "react";
import { Button, Text } from "@mantine/core";
import { IconEyeCheck, IconEyeOff } from "@tabler/icons-react";
import { changeVisibility } from "../utils";
import { TabContext } from "../TabContext";
export interface PrivateButtonProps {
    assetid: string;
    userid: string;
    isPublic?: boolean;
    isPublicPage?: boolean;
}
const PrivateButton: FC<PrivateButtonProps> = ({
    assetid,
    userid,
    isPublic,
}) => {
    const { setPublicFiles, setUserFiles, userFiles } = useContext(TabContext);
    return (
        <Button
            color="gray"
            size="compact-xs"
            title={isPublic ? "Hide" : "Publish"}
            variant="subtle"
            rightIcon={
                isPublic ? <IconEyeOff size={12} /> : <IconEyeCheck size={12} />
            }
            onClick={() =>
                changeVisibility(
                    setPublicFiles,
                    setUserFiles,
                    userFiles,
                    assetid,
                    userid,
                    isPublic
                )
            }
        >
            <Text h="12px" size="12px" lh="1">
                {isPublic ? "Hide" : "Publish"}
            </Text>
        </Button>
    );
};

export default PrivateButton;
