import React, { useState, useEffect, useRef } from "react";
import ModelCard from "../ModelCard/ModelCard";
import HeaderSearch from "../HeaderSearch/HeaderSearch";
import Dropzone from "../Dropzone/Dropzone";
import Grid from "../Grid/Grid";
import { getVideos, uploadVideo } from "../ModelCard/utils";
import { IFile } from "../types";

const PrivateTab = () => {
    const [value, setValue] = useState("");
    const [file, setFile] = useState([] as IFile[]);
    const renderRef = useRef(true);
    const onDrop = (newFile: IFile) => uploadVideo(file, setFile, newFile);
    
    useEffect(() => {
        if (renderRef.current) getVideos(file, setFile);
        return () => {
            renderRef.current = false;
        };
    }, []);

    return (
        <div>
            <HeaderSearch setValue={setValue} data={file} />
            <Dropzone onDrop={onDrop} />
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

export default PrivateTab;
