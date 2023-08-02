import { Button, TextInput, Box, ActionIcon, Group, Text, Tooltip, createStyles, rem, Modal, Checkbox, Skeleton, useMantineTheme, Center } from "@mantine/core";
import { IconCheck, IconPlus, IconRefresh, IconSettings, IconTrash, IconX } from "@tabler/icons-react";
import { S3ClientInfo, getS3Clients, saveS3Client, deleteS3Client } from '@/redux'
import { useContext, useEffect, useState } from "react";
import emitter, { PITCHS3CLIENT } from '@/apps/s3management/event'
import { S3ClientContext } from '@/apps/s3management'
import { useForm, isNotEmpty, hasLength, matches } from '@mantine/form';
import { useDisclosure, useToggle } from "@mantine/hooks";
import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
import { notifications } from "@mantine/notifications";
import { nanoid } from "@reduxjs/toolkit";

function CreateS3Client({ close }: { close: () => void }) {
    const form = useForm({
        initialValues: {
            name: '',
            region: '',
            endpoint: '',
            accessKeyId: '',
            secretAccessKey: '',
            unForcePathStyle: false
        },

        validate: {
            name: hasLength({ min: 2, max: 12 }, '客户端名称长度2-12'),
            region: isNotEmpty('region 不能为空'),
            endpoint: matches(/^(?:(http|https):\/\/)((?:[\w-]+\.)+[a-z0-9]+)((?:\/[^/?#]*)+)?(\?[^#]+)?(#.+)?$/i, 'endpoint 必须是一个有效的url'),
            accessKeyId: isNotEmpty('accessKeyId 不能为空'),
            secretAccessKey: isNotEmpty('secretAccessKey 不能为空'),
        },
    });
    const [check, setCheck] = useState(false)

    const checkForm = () => {
        new S3Client({
            region: form.values.region.trim(),
            endpoint: form.values.endpoint.trim(),
            forcePathStyle: !form.values.unForcePathStyle,
            credentials: {
                accessKeyId: form.values.accessKeyId.trim(),
                secretAccessKey: form.values.secretAccessKey.trim()
            }
        }).send(new ListBucketsCommand({}))
            .then(() => {
                //提示验证成功
                notifications.show({
                    message: '验证成功',
                    icon: <IconCheck size="1.1rem" />,
                    color: 'green'
                })
                setCheck(true)
            }).catch((error) => {
                console.log(error);
                notifications.show({
                    message: '验证失败,检查填写的信息',
                    icon: <IconX size="1.1rem" />,
                    color: 'red'
                })
                setCheck(false)
            })

    }
    const saveForm = () => {
        checkForm()
        if (check) {
            const formValue = form.values
            const client: S3ClientInfo = {
                id: nanoid(),
                name: formValue.name,
                region: formValue.region,
                endpoint: formValue.endpoint,
                forcePathStyle: !form.values.unForcePathStyle,
                credentials: {
                    accessKeyId: formValue.accessKeyId,
                    secretAccessKey: formValue.secretAccessKey
                }
            }
            //保存到配置文件中
            saveS3Client(client).then((ok) => {
                if (ok) {
                    notifications.show({
                        message: '创建成功',
                        icon: <IconCheck size="1.1rem" />,
                        color: 'green'
                    })
                    close()
                } else {
                    notifications.show({
                        message: '创建失败',
                        icon: <IconX size="1.1rem" />,
                        color: 'red'
                    })
                }
            })

        }
    }
    return (
        <Box maw={400} mx="auto" >
            <form onSubmit={form.onSubmit(() => check ? saveForm() : checkForm())}>
                <TextInput
                    label="客户端名称"
                    placeholder="客户端名称"
                    withAsterisk
                    mt="md"
                    {...form.getInputProps('name')}
                />
                <TextInput
                    label="region"
                    placeholder="请输入region"
                    withAsterisk
                    mt="md"
                    {...form.getInputProps('region')}
                />
                <TextInput
                    label="endpoint"
                    placeholder="请输入endpoint"
                    withAsterisk
                    mt="md"
                    {...form.getInputProps('endpoint')}
                />
                <TextInput
                    label="accessKeyId"
                    placeholder="请输入accessKeyId"
                    withAsterisk
                    mt="md"
                    {...form.getInputProps('accessKeyId')}
                />
                <TextInput
                    label="secretKey"
                    placeholder="请输入secretKey"
                    withAsterisk
                    mt="md"
                    {...form.getInputProps('secretAccessKey')}
                />
                <Checkbox
                    label="虚拟主机样式"
                    mt="md"
                    {...form.getInputProps('unForcePathStyle', { type: 'checkbox' })}
                />
                <Group position="right" mt="md">
                    {
                        check ? <Button type="submit">创建</Button> : <Button type="submit">验证</Button>
                    }
                </Group>
            </form>
        </Box>
    );
}

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
    const s3context = useContext(S3ClientContext);
    const [items, setItems] = useState<S3ClientInfo[]>([])
    const [refreshFlag, refresh] = useToggle([true, false])
    const [loading, setLoading] = useState(true);
    const theme = useMantineTheme()
    //获取所有客户端信息
    useEffect(() => {
        getS3Clients()
            .then((clients) => setItems(clients ?? []))
            .catch((error) => {
                console.log(error);
                notifications.show({
                    message: '获取客户端列表失败',
                    icon: <IconX size="1.1rem" />,
                    color: 'red'
                })
            }).finally(() => { setLoading(false) })
    }, [refreshFlag, setItems])
    //新建客户端
    const [openedNewClient, newClientDisclosure] = useDisclosure(false, { onClose: () => refresh() });
    const [openedDeleteClient, deleteClientDisclosure] = useDisclosure(false, { onClose: () => refresh() });
    const checkCurrent = (id: string) => {
        if (s3context.currentClientConfig?.id === id) {
            return {
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2],
                color: theme.colorScheme === 'dark' ? theme.white : theme.black,
            }
        }
        return undefined
    }
    const [deleteId, setDeleteId] = useState<string>();
    //删除客户端
    const deleteClient = () => {
        if (deleteId) {
            deleteS3Client(deleteId)
                .then(() => {
                    notifications.show({
                        message: '删除客户端信息成功',
                        icon: <IconCheck size="1.1rem" />,
                        color: 'green'
                    })
                })
                .catch((e) => {
                    console.log("删除客户端失败", e);
                    notifications.show({
                        message: '删除客户端信息失败',
                        icon: <IconX size="1.1rem" />,
                        color: 'red'
                    })
                })
                .finally(() => {
                    deleteClientDisclosure.close()
                    setTimeout(() => {
                        refresh()
                    },300)
                })
        }
    }
    return (
        <>
            <Modal size="auto" withCloseButton={false} centered opened={openedDeleteClient} onClose={deleteClientDisclosure.close} title=" ">
                <Center mx="auto">
                    确认要<Text c="red">删除</Text>吗？
                </Center>
                <Group mt="xl">
                    <Button variant="outline" color="red" onClick={deleteClient}>
                        删除
                    </Button>
                    <Button variant="outline" onClick={deleteClientDisclosure.close}>
                        取消
                    </Button>
                </Group>
            </Modal>
            <Modal opened={openedNewClient} onClose={newClientDisclosure.close} title="新建客户端">
                <CreateS3Client close={newClientDisclosure.close} />
            </Modal>
            <Group className={classes.collectionsHeader} position="apart">
                <Text size="xs" fw={700} weight={500} >
                    Clients
                </Text>
                <div style={{ display: 'flex' }}>
                    <Tooltip label='刷新' withArrow position="right">
                        <ActionIcon variant="default" size={18} onClick={() => refresh()}>
                            <IconRefresh size="0.8rem" stroke={1.5} />
                        </ActionIcon>
                    </Tooltip>
                    <div style={{ margin: '0 1px' }} />
                    <Tooltip label='添加客户端' withArrow position="right">
                        <ActionIcon variant="default" size={18} onClick={newClientDisclosure.open}>
                            <IconPlus size="0.8rem" stroke={1.5} />
                        </ActionIcon>
                    </Tooltip>
                </div>
            </Group>
            <div className={classes.collections}>
                <Skeleton height='60vh' visible={loading}>
                    {items.map((item) => (
                        <div key={item.id} className={classes.collectionLink} style={checkCurrent(item.id)}>
                            <Group position="apart">
                                <a onClick={() => { emitter.emit(PITCHS3CLIENT, item) }}>
                                    {item.name}
                                </a>
                                <div style={{
                                    display: 'flex',
                                }}>
                                    <ActionIcon size={15} variant="transparent"><IconSettings size="0.9rem" /></ActionIcon>
                                    <ActionIcon size={15} variant="transparent" style={{ marginRight: '-7px' }} onClick={() => {
                                        setDeleteId(item.id)
                                        deleteClientDisclosure.open()
                                    }}>
                                        <IconTrash size="0.9rem" color="#c97273" />
                                    </ActionIcon>
                                </div>
                            </Group>
                        </div>

                    ))}
                </Skeleton>
            </div>
        </>
    )
}
