import React, { useState, useEffect, useRef } from "react";
import { Tabs } from "@mantine/core";
import PublicTab from "./PublicTab/PublicTab";
import PrivateTab from "./PrivateTab/PrivateTab";

const App = () => {
    return (
        <Tabs defaultValue="public">
            <Tabs.List>
                <Tabs.Tab value="public">Public videos</Tabs.Tab>

                <Tabs.Tab value="private">Private videos</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="public">
                <PublicTab />
            </Tabs.Panel>

            <Tabs.Panel value="private">
                <PrivateTab />
            </Tabs.Panel>
        </Tabs>
    );
};

export default App;
