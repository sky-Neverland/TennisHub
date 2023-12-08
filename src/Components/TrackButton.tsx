import React, { FC } from "react";
import { Button, Text } from "@mantine/core";
import { IconDeviceAnalytics } from "@tabler/icons-react";
import { trackVideo } from "../utils";
import { IFile, TrackState } from "../types";

export interface TrackButtonProps {
    setFiles: React.Dispatch<React.SetStateAction<IFile[]>>;
    assetid: string;
    userid: string;
    disabled?: boolean;
    track: TrackState;
    showTrack?: boolean;
    setShowTrack?: React.Dispatch<React.SetStateAction<boolean>>;
}
const TrackButton: FC<TrackButtonProps> = ({
    setFiles,
    assetid,
    userid,
    disabled,
    track,
    showTrack,
    setShowTrack,
}) => {
    const onChange = () => {
        if (track === TrackState.DONE)
            setShowTrack && setShowTrack((prev) => !prev);
        else
            setShowTrack && trackVideo(setFiles, assetid, userid, setShowTrack);
    };
    return (
        <Button
            disabled={disabled}
            color="gray"
            size="compact-xs"
            title={showTrack ? "View untracked" : "Track"}
            variant="subtle"
            rightIcon={<IconDeviceAnalytics size={12} />}
            onClick={onChange}
        >
            <Text h="12px" size="12px" lh="1">
                {showTrack ? "View untracked" : "Track"}
            </Text>
        </Button>
    );
};

export default TrackButton;
