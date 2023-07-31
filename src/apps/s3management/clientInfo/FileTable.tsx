/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState } from 'react';
import { createStyles, Table, Checkbox, ScrollArea, rem, Flex, ActionIcon, Popover, Button, Anchor } from '@mantine/core';
import { IconCheck, IconDownload, IconLink, IconTrash, IconX } from '@tabler/icons-react';
import { DeleteObjectCommand, GetObjectCommand, ListObjectsCommand, ListObjectsCommandOutput, ListObjectsV2CommandOutput } from '@aws-sdk/client-s3';
import dayjs from 'dayjs';
import emitter, { ENTERFOLDER, REFRESH } from '@/apps/s3management/event'
import { S3ClientContext } from '@/apps/s3management';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { notifications } from '@mantine/notifications';
import { openUrl } from '@/redux';
//删除按钮
const DeleteButton = ({ item }: { item: FileInfo }) => {
    const [show, setShow] = useState<boolean>(false);
    const { currentBucket, currentClient } = useContext(S3ClientContext);
    //删除当前文件目录
    const deleteDirectory = () => {
        setShow(false)
        if (item.type !== 'directory') {
            return
        }
        currentClient?.send(new ListObjectsCommand({
            Bucket: currentBucket?.Name,
            Prefix: item.id,
            MaxKeys: 2
        })).then((response: ListObjectsCommandOutput) => {
            if (response.Contents?.filter((obj) => obj.Key !== item.id).length !== 0) {
                notifications.show({
                    message: '目录下存在文件，不能删除',
                    icon: <IconX size="1.1rem" />,
                    color: 'red'
                })
                return
            }
            currentClient?.send(new DeleteObjectCommand({
                Bucket: currentBucket?.Name,
                Key: item.id
            })).then(() => {
                notifications.show({
                    message: '删除成功',
                    icon: <IconCheck size="1.1rem" />,
                    color: 'green'
                })
                emitter.emit(REFRESH)
            }).catch((error) => {
                console.log(error);
                notifications.show({
                    message: '删除失败',
                    icon: <IconX size="1.1rem" />,
                    color: 'red'
                })
            })
        }).catch((error) => {
            console.log(error);
            notifications.show({
                message: '判断目录下是否有文件失败',
                icon: <IconX size="1.1rem" />,
                color: 'red'
            })

        })
    }
    //删除当前文件
    const deleteFile = () => {
        setShow(false)
        if (item.type !== 'file') {
            return
        }
        currentClient?.send(new DeleteObjectCommand({
            Bucket: currentBucket?.Name,
            Key: item.id
        })).then(() => {
            notifications.show({
                message: '删除成功',
                icon: <IconCheck size="1.1rem" />,
                color: 'green'
            })
            emitter.emit(REFRESH)
        }).catch((error) => {
            console.log(error);
            notifications.show({
                message: '删除失败',
                icon: <IconX size="1.1rem" />,
                color: 'red'
            })
        })

    }
    return (
        <Popover opened={show} trapFocus position="bottom" withArrow shadow="md" >
            <Popover.Target>
                <ActionIcon variant="subtle" onClick={() => setShow(true)}><IconTrash size="1rem" color='#b73b3e' /></ActionIcon>
            </Popover.Target>
            <Popover.Dropdown onBlur={() => setShow(false)}>
                {
                    (item.type === 'directory' ? '将删除目录下所有文件!' : '确认要删除吗？')
                }
                <br />
                <Button style={{ marginRight: '3px' }} variant="light" size='xs' color="red" onClick={() => item.type === 'file' ? deleteFile() : deleteDirectory()}>
                    确认
                </Button>
                <Button variant="light" size='xs' onClick={() => setShow(false)}>
                    取消
                </Button>
            </Popover.Dropdown>
        </Popover>
    )
}

const useStyles = createStyles((theme) => ({
    rowSelected: {
        backgroundColor:
            theme.colorScheme === 'dark'
                ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
                : theme.colors[theme.primaryColor][0],
    },
    header: {
        position: 'sticky',
        top: 0,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        transition: 'box-shadow 150ms ease',

        '&::after': {
            content: '""',
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            borderBottom: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]
                }`,
        },
    },

    scrolled: {
        boxShadow: theme.shadows.sm,
    },
}));

export type FileInfo = {
    id: string;
    name: string;
    type: 'directory' | 'file';
    size?: number;
    lastModified: string;
}
interface FileTable {
    data?: FileInfo[];
}
export default function FileTable({ objects }: { objects?: ListObjectsV2CommandOutput }) {
    const { classes, cx } = useStyles();
    const { currentBucket, currentClient } = useContext(S3ClientContext);
    //获取对象链接
    const getObjectUrl = (objectKey: string) => {
        if (currentClient) {
            getSignedUrl(currentClient as any,
                new GetObjectCommand(
                    {
                        Bucket: currentBucket?.Name,
                        Key: objectKey,
                    }) as any,
                { expiresIn: 3600 })
                .then((url) => {
                    navigator.clipboard.writeText(url)
                    notifications.show({
                        message: '下载链接(有效期1小时)已复制到粘贴板',
                        icon: <IconCheck size="1.1rem" />,
                        color: 'blue',
                        autoClose: 1000,
                    })
                }).catch((error) => {
                    console.log("获取对象下载链接失败", error);
                    notifications.show({
                        message: '获取文件下载地址失败',
                        icon: <IconX size="1.1rem" />,
                        color: 'red',
                        autoClose: 3000,
                    })
                })
        }
    }
    //下载对象
    const downloadObject = (objectKey: string) => {
        if (currentClient) {
            getSignedUrl(currentClient as any,
                new GetObjectCommand(
                    {
                        Bucket: currentBucket?.Name,
                        Key: objectKey,
                    }) as any,
                { expiresIn: 60 })
                .then(openUrl)
                .catch((error) => {
                    console.log("获取对象下载链接失败", error);
                    notifications.show({
                        message: '获取文件下载地址失败',
                        icon: <IconX size="1.1rem" />,
                        color: 'red',
                        autoClose: 3000,
                    })
                })
        }
    }

    //转换成FileInfo
    const data: FileInfo[] = objects?.CommonPrefixes?.map((item) => {
        const ossDirectoryPaths = item.Prefix?.split('/')?.filter((item) => item != '')
        const name = ossDirectoryPaths?.[ossDirectoryPaths.length - 1] ?? ''
        return {
            id: item.Prefix ?? "",
            name: name,
            type: 'directory',
            size: 0,
            lastModified: '',
        }
    }) ?? []
    const dataFiles: FileInfo[] = objects?.Contents?.filter((item) => !item.Key?.endsWith('/'))?.map((item) => {
        const osskeyPath = item.Key?.split('/')
        const name = osskeyPath?.[osskeyPath.length - 1] ?? ''
        return {
            id: item.Key ?? '',
            name: name,
            type: 'file',
            size: item.Size,
            lastModified: dayjs(item.LastModified)?.format("YYYY-MM-DD hh:mm:ss") ?? '',
        }
    }) ?? []
    data.push(...dataFiles)
    //选中
    const [selection, setSelection] = useState<string[]>([]);
    const toggleRow = (id: string) =>
        setSelection((current) =>
            current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
        );
    const toggleAll = () =>
        setSelection((current) => (current.length === data.length ? [] : data.map((item) => item.id)));
    //行样式
    const rows = data.map((item) => {
        const selected = selection.includes(item.id);
        return (
            <tr key={item.id} className={cx({ [classes.rowSelected]: selected })}>
                <td>
                    <Checkbox
                        size="xs"
                        checked={selected}
                        onChange={() => toggleRow(item.id)}
                        transitionDuration={0}
                    />
                </td>
                <td style={{ textAlign: "center", verticalAlign: 'middle' }}>
                    {
                        item.type === 'directory' ? <Anchor onClick={() => emitter.emit(ENTERFOLDER, item.id)} >{item.name}</Anchor> : item.name
                    }

                </td>
                <td style={{ textAlign: "center", verticalAlign: 'middle' }}>{item.type === 'directory' ? '目录' : '文件'}</td>
                <td style={{ textAlign: "center", verticalAlign: 'middle' }}>{item.size ? (item.size / 1024).toFixed(2) + 'KB' : ''}</td>
                <td style={{ textAlign: "center", verticalAlign: 'middle' }}>{item.lastModified}</td>
                <td >
                    <Flex
                        justify="center"
                        align="center"
                    >
                        {
                            item.type === 'file' ?
                                <>
                                    <ActionIcon variant="subtle" onClick={() => getObjectUrl(item.id)}><IconLink size="1rem" /></ActionIcon>
                                    <ActionIcon variant="subtle" onClick={() => downloadObject(item.id)}><IconDownload size="1rem" color='#0074cc' /></ActionIcon>
                                </>
                                : null
                        }
                        <DeleteButton item={item}></DeleteButton>
                    </Flex>
                </td>
            </tr>
        );
    });
    return (
        <>
            <ScrollArea h={'75vh'} >
                <Table verticalSpacing={5}>
                    <thead className={cx(classes.header)}>
                        <tr>
                            <th style={{ width: rem(40) }}>
                                <Checkbox
                                    size="xs"
                                    onChange={toggleAll}
                                    checked={selection.length === data.length}
                                    indeterminate={selection.length > 0 && selection.length !== data.length}
                                    transitionDuration={0}
                                />
                            </th>
                            <th style={{ textAlign: "center" }}>名称</th>
                            <th style={{ textAlign: "center" }}>类型</th>
                            <th style={{ textAlign: "center" }}>大小</th>
                            <th style={{ textAlign: "center" }}>最后修改时间</th>
                            <th style={{ textAlign: "center" }}>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </Table>
            </ScrollArea>
        </>
    );
}