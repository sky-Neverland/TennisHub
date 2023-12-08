import React, { createContext, useState, FC } from "react";
import { IFile } from "./types";

interface VideoContext {
    publicFiles: IFile[];
    setPublicFiles: React.Dispatch<React.SetStateAction<IFile[]>>;
    userFiles: IFile[];
    setUserFiles: React.Dispatch<React.SetStateAction<IFile[]>>;
}
export const TabContext = createContext<VideoContext>({
    publicFiles: [],
    setPublicFiles: () => {},
    userFiles: [],
    setUserFiles: () => {},
});

export const TabContextProvider = ({ children }) => {
    const [publicFiles, setPublicFiles] = useState<IFile[]>([]);
    const [userFiles, setUserFiles] = useState<IFile[]>([]);
    return (
        <TabContext.Provider
            value={{
                publicFiles,
                setPublicFiles,
                userFiles,
                setUserFiles,
            }}
        >
            {children}
        </TabContext.Provider>
    );
};
