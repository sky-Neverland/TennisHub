import React, { Children, FC } from "react";
import { createStyles, Header, Autocomplete, Group, rem } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { IFile } from "../../types";

const useStyles = createStyles((theme) => ({
    inner: {
        height: rem(56),
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },

    links: {
        [theme.fn.smallerThan("md")]: {
            display: "none",
        },
    },

    search: {
        [theme.fn.smallerThan("xs")]: {
            display: "none",
        },
    },
}));

const HeaderSearch: FC<{
    data: IFile[];
    setValue: (value: string) => void;
}> = ({ data, setValue }) => {
    const { classes } = useStyles();

    return (
        <div className={classes.inner}>
            <Group>
                <Autocomplete
                    className={classes.search}
                    placeholder="Search"
                    icon={<IconSearch size="16px" stroke={1.5} />}
                    data={data.map((file) => file.assetname)}
                    onChange={(value) => setValue(value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") setValue(e.currentTarget.value);
                    }}
                />
            </Group>
        </div>
    );
};

export default HeaderSearch;
