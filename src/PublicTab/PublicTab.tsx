import React, { useState, useEffect, useRef } from "react";
import ModelCard from "../ModelCard/ModelCard";
import HeaderSearch from "../HeaderSearch/HeaderSearch";
import Dropzone from "../Dropzone/Dropzone";
import Grid from "../Grid/Grid";
import { FILES } from "../constants";
import { getVideos, uploadVideo } from "../ModelCard/utils";
import { IFile } from "../types";

const PublicTab = () => {
    const [value, setValue] = useState("");
    const [file, setFile] = useState(FILES);
    const renderRef = useRef(true);
    useEffect(() => {
        if (renderRef.current) getVideos(file, setFile);
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
                            key={file.name}
                            title={file.name}
                            display={file.name.includes(value)}
                        >
                            <iframe
                                src={file.src}
                                title="YouTube video player"
                                style={{ border: 0 }}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </ModelCard>
                    );
                })}
            </Grid>
        </div>
    );
};

export default PublicTab;
