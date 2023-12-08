import React from "react";
// import { IconBookmark, IconHeart, IconShare } from "@tabler/icons-react";
import {
    Card,
    Image,
    Text,
    Badge,
    Group,
    Center,
    createStyles,
    rem,
    Flex,
} from "@mantine/core";
import { TrackState } from "../types";
import { IconUser } from "@tabler/icons-react";

const useStyles = createStyles((theme) => ({
    card: {
        position: "relative",
        backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    },

    rating: {
        position: "absolute",
        top: theme.spacing.xs,
        right: rem(12),
        pointerEvents: "none",
    },

    title: {
        display: "block",
        width: "100%",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },

    action: {
        backgroundColor:
            theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
        ...theme.fn.hover({
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[5]
                    : theme.colors.gray[1],
        }),
    },

    footer: {
        marginTop: theme.spacing.md,
    },
}));

interface ArticleCardProps {
    display: boolean;
    image?: string;
    link?: string;
    title?: string;
    rating?: string;
    author?: string;
    deleteButton?: React.ReactNode;
}

const ArticleCard = ({
    className,
    display,
    image,
    link,
    title,
    author,
    rating,
    children,
    deleteButton,
    ...others
}: ArticleCardProps &
    Omit<React.ComponentPropsWithoutRef<"div">, keyof ArticleCardProps>) => {
    const { classes, cx, theme } = useStyles();
    return (
        <Card
            style={{ display: display ? "block" : "none" }}
            withBorder
            radius="md"
            className={cx(classes.card, className)}
            {...others}
        >
            {image && (
                <Card.Section>
                    <Image src={image} height={180} />
                </Card.Section>
            )}
            <Card.Section>{children} </Card.Section>
            {rating === TrackState.DONE && (
                <Badge
                    className={classes.rating}
                    variant="gradient"
                    gradient={{ from: "yellow", to: "red" }}
                >
                    {rating}
                </Badge>
            )}
            {rating === TrackState.PENDING && (
                <Badge
                    className={classes.rating}
                    variant="outline"
                    color="gray"
                >
                    {rating}
                </Badge>
            )}
            {rating === TrackState.UNTRACKED && (
                <Badge
                    className={classes.rating}
                    variant="outline"
                    color="blue"
                >
                    {rating}
                </Badge>
            )}
            <Flex justify="space-between" align="center">
                {title && (
                    <Text className={classes.title} fw={500}>
                        {title}
                    </Text>
                )}
                {deleteButton}
            </Flex>

            {author && (
                <Group position="apart" className={classes.footer}>
                    <Center>
                        <IconUser size={16} />
                        <Text fz="sm" ml="sm" inline>
                            {author}
                        </Text>
                    </Center>
                </Group>
            )}
        </Card>
    );
};

export default ArticleCard;
