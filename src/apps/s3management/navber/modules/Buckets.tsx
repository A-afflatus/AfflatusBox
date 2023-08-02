/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bucket, CreateBucketCommand, ListBucketsCommand } from "@aws-sdk/client-s3";
import { ActionIcon, Group, Modal, Skeleton, Text, TextInput, Tooltip, createStyles, rem, useMantineTheme } from "@mantine/core";
import { IconCheck, IconPlus, IconRefresh, IconX } from "@tabler/icons-react";
import { useContext, useEffect, useState } from "react";
import { S3Context, S3ClientContext } from '@/apps/s3management'
import emitter, { PITCHBUCKET } from "@/apps/s3management/event";
import { notifications } from "@mantine/notifications";
import { useDisclosure, useToggle } from "@mantine/hooks";
const useStyles = createStyles((theme) => ({
    collections: {
        paddingLeft: `calc(${theme.spacing.md} - ${rem(6)})`,
        paddingRight: `calc(${theme.spacing.md} - ${rem(6)})`,
        paddingBottom: theme.spacing.md,
    },
    collectionsHeader: {
        paddingLeft: `calc(${theme.spacing.md} + ${rem(2)})`,
        paddingRight: theme.spacing.md,
        marginBottom: rem(5),
    },
    collectionLink: {
        display: 'block',
        padding: `${rem(8)} ${theme.spacing.xs}`,
        textDecoration: 'none',
        borderRadius: theme.radius.sm,
        fontSize: theme.fontSizes.xs,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
        lineHeight: 1,
        fontWeight: 500,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
    },
}));



export default function BottomLinks() {
    const { classes } = useStyles()
    const s3Context: S3Context = useContext(S3ClientContext);
    const [items, setItems] = useState<Bucket[]>([])
    const [flag, refresh] = useToggle([true, false]);
    const [loading, setLoading] = useState(true);
    const theme = useMantineTheme()
    useEffect(() => {
        setLoading(true)
        s3Context.currentClient?.send(new ListBucketsCommand({}))
            .then((response) => {
                setItems(response.Buckets ?? [])
            }).catch((error) => {
                console.log(error);
                notifications.show({
                    message: '获取bucket列表失败',
                    icon: <IconX size="1.1rem" />,
                    color: 'red'
                })
            })
        setLoading(false)
    }, [s3Context, setItems, flag])

    const [openedCreateBucket, disclosureCreateBucket] = useDisclosure(false);
    const createBucket = (name: string) => {
        s3Context.currentClient?.send(new CreateBucketCommand({ Bucket: name }))
            .then(() => {
                notifications.show({
                    message: '创建bucket成功',
                    icon: <IconCheck size="1.1rem" />,
                    color: 'green'
                })
                refresh()
            }).catch((error) => {
                console.log("创建bucket失败", error);
                notifications.show({
                    message: '创建bucket失败',
                    icon: <IconX size="1.1rem" />,
                    color: 'red'
                })

            })
    }
    const checkCurrent = (name:string)=>{
        if(s3Context.currentBucket?.Name === name){
            return {
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2],
                color: theme.colorScheme === 'dark' ? theme.white : theme.black,
            }
        }
        return undefined
    }
    return (
        <>
            <Modal opened={openedCreateBucket} onClose={disclosureCreateBucket.close} title="创建目录" centered>
                <TextInput placeholder="桶名称[只能包含小写字母、数字、连字符（-）和句点(.)]" onKeyDown={(event) => {
                    const name = ((event.target as any).value as string)?.trim().toLocaleLowerCase();
                    if (name && event.key === 'Enter' && name !== '' && !name.includes('/')) {
                        createBucket(name)
                        disclosureCreateBucket.close()
                    }
                }} />
            </Modal>
            <Group className={classes.collectionsHeader} position="apart">
                <Text size="xs" fw={700} weight={500} >
                    Buckets
                </Text>
                <div style={{ display: 'flex' }}>
                    <Tooltip label="刷新" withArrow position="right">
                        <ActionIcon variant="default" size={18} onClick={() => refresh()}>
                            <IconRefresh size="0.8rem" stroke={1.5} />
                        </ActionIcon>
                    </Tooltip>
                    <div style={{ margin: '0 1px' }} />
                    <Tooltip label="添加桶" withArrow position="right">
                        <ActionIcon variant="default" size={18} onClick={disclosureCreateBucket.open}>
                            <IconPlus size="0.8rem" stroke={1.5} />
                        </ActionIcon>
                    </Tooltip>
                </div>
            </Group>
            <div className={classes.collections}>
                <Skeleton height='60vh' visible={loading}>
                    {
                        items.map((item) => (
                            <a
                                key={item.Name ?? "" + item.CreationDate}
                                className={classes.collectionLink}
                                onClick={() => { emitter.emit(PITCHBUCKET, item) }}
                                style={checkCurrent(item.Name??"")}
                            >

                                {item.Name}
                            </a>
                        ))}
                </Skeleton>
            </div>
        </>
    )
}
