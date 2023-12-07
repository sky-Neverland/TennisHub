import React, { useState, useEffect, useRef } from "react";
import ModelCard from "../ModelCard/ModelCard";
import HeaderSearch from "../HeaderSearch/HeaderSearch";
import Grid from "../Grid/Grid";
import { getPulicVideos } from "../utils";
import { IFile, TrackState } from "../types";

const PublicTab = () => {
    const [value, setValue] = useState("");
    const [file, setFile] = useState<IFile[]>([]);
    const renderRef = useRef(true);
    useEffect(() => {
        if (renderRef.current) getPulicVideos(setFile);
        return () => {
            renderRef.current = false;
        };
    }, []);

    return (
        <div>
            <HeaderSearch setValue={setValue} data={file} />
            <Grid>
                {file.map((file) => {
                    return (
                        <ModelCard
                            key={file.assetid}
                            title={file.assetname}
                            display={file.assetname.includes(value)}
                        >
                            <iframe
                                src={file.org_video_url}
                                title="YouTube video player"
                                style={{ border: 0 }}
                                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>

                            {file.tracked === TrackState.DONE && (
                                <iframe
                                    src={file.new_video_url}
                                    title="YouTube video player"
                                    style={{ border: 0 }}
                                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                            )}
                        </ModelCard>
                    );
                })}
            </Grid>
        </div>
    );
};

export default PublicTab;
