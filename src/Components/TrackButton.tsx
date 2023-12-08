import React, { FC, useContext } from "react";
import { Button, Text } from "@mantine/core";
import { IconDeviceAnalytics } from "@tabler/icons-react";
import { trackVideo } from "../utils";
import { IFile, TrackState } from "../types";
import { TabContext } from "../TabContext";

export interface TrackButtonProps {
    assetid: string;
    userid: string;
    track: TrackState;
    showTrack?: boolean;
    setShowTrack?: React.Dispatch<React.SetStateAction<boolean>>;
}
const TrackButton: FC<TrackButtonProps> = ({
    assetid,
    userid,
    track,
    showTrack,
    setShowTrack,
}) => {
    const { setPublicFiles, setUserFiles, userFiles } = useContext(TabContext);
    const onChange = () => {
        if (track === TrackState.DONE)
            setShowTrack && setShowTrack((prev) => !prev);
        else
            setShowTrack &&
                trackVideo(
                    setPublicFiles,
                    setUserFiles,
                    userid,
                    assetid,
                    setShowTrack
                );
    };

    return (
        <Button
            disabled={track === TrackState.PENDING}
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
