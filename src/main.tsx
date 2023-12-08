import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import App from "./App";
import "./style.css";
import { TabContextProvider } from "./TabContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <MantineProvider
            theme={{ colorScheme: "dark" }}
            withGlobalStyles
            withNormalizeCSS
        >
            <TabContextProvider>
                <App />
            </TabContextProvider>
        </MantineProvider>
    </React.StrictMode>
);
