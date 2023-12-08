import { getUsers } from "./utils";
import { IUser } from "./types";
import React, { useState, useRef, useEffect } from "react";
import PublicTab from "./PublicTab/PublicTab";
import UserTab from "./UserTab/UserTab";
import { Container, Flex, Tabs, Text } from "@mantine/core";
import { IconBallTennis } from "@tabler/icons-react";
import classes from "./App.module.less";
import UserSelect from "./UserSelect";

export function App() {
    const [users, setUsers] = useState<IUser[]>([]);
    const renderRef = useRef(true);
    const [userId, setUserId] = useState<string>("");
    useEffect(() => {
        if (renderRef.current) getUsers(setUsers);
        return () => {
            renderRef.current = false;
        };
    }, []);

    return (
        <div className={classes.header}>
            <Container size="md">
                <Flex justify="space-between" align="baseline">
                    <Text size={28} className={classes.title}>
                        <IconBallTennis size={32} /> Tennis Hub
                    </Text>
                    <UserSelect users={users} setUserId={setUserId} />
                </Flex>
            </Container>
            <Container size="lg">
                <Tabs defaultValue="public">
                    <Tabs.List>
                        <Tabs.Tab value="public">Public videos</Tabs.Tab>

                        <Tabs.Tab value="user">User videos</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="public">
                        <PublicTab users={users} userId={userId} />
                    </Tabs.Panel>

                    <Tabs.Panel value="user">
                        <UserTab userId={userId} />
                    </Tabs.Panel>
                </Tabs>
            </Container>
        </div>
    );
}

export default App;
