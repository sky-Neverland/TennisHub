import React from "react";
import { SimpleGrid, Container } from "@mantine/core";

const Subgrid = ({ children }) => {
    return (
        <Container my="md" maw="100%">
            <SimpleGrid cols={3} breakpoints={[{ maxWidth: "md", cols: 1 }]}>
                {children}
            </SimpleGrid>
        </Container>
    );
};

export default Subgrid;
