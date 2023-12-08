import React, { useState, FC } from "react";
import { Image } from "@mantine/core";

const Preview: FC<{ src?: string }> = ({ src }) => {
    return (
        <>
            {src && (
                <iframe
                    src={src}
                    style={{ border: 0 }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            )}
        </>
    );
};

export default Preview;
