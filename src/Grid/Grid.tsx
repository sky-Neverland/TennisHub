import React from "react";
import {
    SimpleGrid,
    Container,
    Stack,
} from "@mantine/core";

const Subgrid = ({ children }) => {
    return (
        <Container my="md">
            <SimpleGrid cols={3} breakpoints={[{ maxWidth: "md", cols: 1 }]}>
                {children}
            </SimpleGrid>
        </Container>
    );
};

export default Subgrid;
