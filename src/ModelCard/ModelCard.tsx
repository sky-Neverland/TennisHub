import React from "react";
// import { IconBookmark, IconHeart, IconShare } from "@tabler/icons-react";
import {
    Card,
    Image,
    Text,
    ActionIcon,
    Badge,
    Group,
    Center,
    Avatar,
    createStyles,
    rem,
} from "@mantine/core";

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
        marginTop: theme.spacing.md,
        marginBottom: rem(5),
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
    description?: string;
    rating?: string;
    author?: {
        name: string;
        image: string;
    };
}

const ArticleCard = ({
    className,
    display,
    image,
    link,
    title,
    description,
    author,
    rating,
    children,
    ...others
}: ArticleCardProps &
    Omit<React.ComponentPropsWithoutRef<"div">, keyof ArticleCardProps>) => {
    const { classes, cx, theme } = useStyles();
    const linkProps = {
        href: link,
        target: "_blank",
        rel: "noopener noreferrer",
    };

    return (
        <Card
            style={{display: display ? "block" : "none"}}
            withBorder
            radius="md"
            className={cx(classes.card, className)}
            {...others}
        >
            {image && (
                <Card.Section>
                    <a {...linkProps}>
                        <Image src={image} height={180} />
                    </a>
                </Card.Section>
            )}
            <Card.Section>{children} </Card.Section>
            {rating && (
                <Badge
                    className={classes.rating}
                    variant="gradient"
                    gradient={{ from: "yellow", to: "red" }}
                >
                    {rating}
                </Badge>
            )}
            {title && (
                <Text
                    className={classes.title}
                    fw={500}
                    component="a"
                    {...linkProps}
                >
                    {title}
                </Text>
            )}

            {description && (
                <Text fz="sm" color="dimmed" lineClamp={4}>
                    {description}
                </Text>
            )}
            <Group position="apart" className={classes.footer}>
                {author && (
                    <Center>
                        <Avatar
                            src={author.image}
                            size={24}
                            radius="xl"
                            mr="xs"
                        />

                        <Text fz="sm" inline>
                            {author.name}
                        </Text>
                    </Center>
                )}
                {/* <Group spacing={8} mr={0}>
                    <ActionIcon className={classes.action}>
                        <IconHeart size="16px" color={theme.colors.red[6]} />
                    </ActionIcon>
                    <ActionIcon className={classes.action}>
                        <IconBookmark
                            size="16px"
                            color={theme.colors.yellow[7]}
                        />
                    </ActionIcon>
                    <ActionIcon className={classes.action}>
                        <IconShare size="16px" />
                    </ActionIcon>
                </Group> */}
            </Group>
        </Card>
    );
};

export default ArticleCard;
