import React from "react";
// import { IconBookmark, IconHeart, IconShare } from "@tabler/icons-react";
import {
    Card,
    Text,
    Badge,
    Group,
    Center,
    createStyles,
    rem,
    Flex,
} from "@mantine/core";
import { TrackState } from "../../types";
import { IconUser } from "@tabler/icons-react";
import {
    DeleteButton,
    DeleteButtonProps,
    PrivateButton,
    PrivateButtonProps,
    TrackButton,
    TrackButtonProps,
} from "../../Components";

const useStyles = createStyles((theme) => ({
    card: {
        position: "relative",
        backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    },

    track: {
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

interface ArticleCardProps
    extends DeleteButtonProps,
        PrivateButtonProps,
        TrackButtonProps {
    display: boolean;
    link?: string;
    title?: string;
    author?: string;
    src: string;
    newSrc?: string;
    isPublicPage?: boolean;
}

const ArticleCard = ({
    className,
    display,
    link,
    title,
    author,
    src,
    newSrc,
    setFiles,
    assetid,
    userid,
    isPublic,
    track,
    isPublicPage,
    ...others
}: ArticleCardProps &
    Omit<React.ComponentPropsWithoutRef<"div">, keyof ArticleCardProps>) => {
    const { classes, cx, theme } = useStyles();
    const [showTrack, setShowTrack] = React.useState<boolean>(false);
    return (
        <Card
            style={{ display: display ? "block" : "none" }}
            withBorder
            radius="md"
            className={cx(classes.card, className)}
            {...others}
        >
            <Card.Section>
                <iframe
                    src={track === TrackState.DONE && showTrack ? newSrc : src}
                    title="YouTube video player"
                    style={{ border: 0, aspectRatio: 16 / 9 }}
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                    width="100%"
                ></iframe>
            </Card.Section>
            {track === TrackState.DONE && (
                <Badge
                    className={classes.track}
                    variant="gradient"
                    gradient={{ from: "yellow", to: "red" }}
                >
                    {track}
                </Badge>
            )}
            {track === TrackState.PENDING && (
                <Badge
                    className={classes.track}
                    variant="outline"
                    color="gray"
                >
                    {track}
                </Badge>
            )}
            {track === TrackState.UNTRACKED && (
                <Badge
                    className={classes.track}
                    variant="outline"
                    color="blue"
                >
                    {track}
                </Badge>
            )}
            {track === TrackState.FAILED && (
                <Badge className={classes.track} color="red">
                    {track}
                </Badge>
            )}
            <Flex justify="space-between" align="center">
                {title && (
                    <Text className={classes.title} fw={500}>
                        {title}
                    </Text>
                )}
                <TrackButton
                    setFiles={setFiles}
                    assetid={assetid}
                    userid={userid}
                    showTrack={showTrack}
                    setShowTrack={setShowTrack}
                    track={track}
                />
                <PrivateButton
                    isPublicPage = {isPublicPage}
                    setFiles={setFiles}
                    assetid={assetid}
                    userid={userid}
                    isPublic={isPublic}
                />
                <DeleteButton
                    setFiles={setFiles}
                    assetid={assetid}
                    userid={userid}
                />
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
