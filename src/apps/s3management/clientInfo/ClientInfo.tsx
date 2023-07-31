/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FileButton, Flex, Grid, Input, Modal, TextInput } from "@mantine/core";
import { IconArrowBigLeft, IconArrowBigRight, IconArrowBigUp, IconRefresh, IconHome2, IconFolderPlus, IconSearch, IconChevronLeft, IconFileUpload, IconChevronRight, IconX, IconCheck } from "@tabler/icons-react";
import FileTable from './FileTable'
import { useContext, useEffect, useRef, useState } from "react";
import { useDisclosure, useToggle } from "@mantine/hooks";
import { S3ClientContext } from '@/apps/s3management'
import { ListObjectsV2Command, ListObjectsV2CommandInput, ListObjectsV2CommandOutput, PutObjectCommand } from "@aws-sdk/client-s3";
import { notifications } from "@mantine/notifications";
import emitter, { ENTERFOLDER, REFRESH, UPLOADFILE } from "@/apps/s3management/event";
export default function ClientInfo() {
    const s3Context = useContext(S3ClientContext)
    const [objects, setObects] = useState<ListObjectsV2CommandOutput>()
    const [directoryPath, setDirectoryPath] = useState<string>("")
    //分页token栈
    const [tokenStack, setTokenStack] = useState<string[]>([])
    const pushTokenStack = (item: string) => {
        setTokenStack([...tokenStack, item]);
    };

    const popTokenStack = () => {
        if (tokenStack.length === 0) {
            return;
        }
        const tts = [...tokenStack];
        tts.pop();
        setTokenStack(tts);
    };
    // 搜索功能
    const directoryPathRef = useRef(null)
    const directorySearchRef = useRef(null)
    const updateDirectoryPath = () => {
        let path = ((directoryPathRef?.current as any).value as string)?.trim() ?? "";
        if (path !== "" && !path.endsWith("/")) {
            path = path + "/"
        }
        const searchStr = ((directorySearchRef?.current as any).value as string)?.trim() ?? "";
        (directoryPathRef?.current as any).value = path
        setDirectoryPath(path + searchStr)
    }
    // 回到根目录
    const toHome = () => {
        (directoryPathRef?.current as any).value = '';
        (directorySearchRef?.current as any).value = ''
        setDirectoryPath('')
    }
    //刷新
    const [refreshFlag, refresh] = useToggle([true, false]);
    useEffect(() => {
        const paths = directoryPath.split('/');
        paths.pop();
        const inputValue = paths.join('/') + '/';
        (directoryPathRef?.current as any).value = inputValue === '/' ? '' : inputValue;
        if (s3Context.currentClient && s3Context.currentBucket) {
            let command: ListObjectsV2CommandInput = {
                Bucket: s3Context.currentBucket.Name,
                Delimiter: '/',
                Prefix: directoryPath,
                MaxKeys: 10
            }
            if (tokenStack.length > 0) {
                command = {
                    ...command,
                    ContinuationToken: tokenStack[tokenStack.length - 1]
                }
            }
            s3Context.currentClient.send(new ListObjectsV2Command(command))
                .then((response) => {
                    setObects(response)
                }).catch((error) => {
                    console.log(error);
                    notifications.show({
                        message: '获取bucket下文件列表失败',
                        icon: <IconX size="1.1rem" />,
                        color: 'red'
                    })
                })
        }
    }, [directoryPath, s3Context, refreshFlag, tokenStack])
    //点击文件夹事件
    useEffect(() => {
        //再订阅事件
        emitter.on(ENTERFOLDER, setDirectoryPath)
        //订阅刷新数据事件
        emitter.on(REFRESH, refresh)
        return () => {
            emitter.off(ENTERFOLDER,setDirectoryPath)
            emitter.off(REFRESH,refresh)
          }
    }, [refresh])
    //上一级
    const topLevel = () => {
        const paths = directoryPath.split('/')
        paths.pop()
        paths.pop()
        const afterPath = paths.join('/')
        setDirectoryPath(afterPath === '' ? '' : afterPath + '/')
    }
    //创建目录
    const createDirectory = (name: string) => {
        if (s3Context.currentClientConfig && s3Context.currentBucket) {
            const basePaths = directoryPath.split('/')
            basePaths.pop()
            const basePath = basePaths.join('/') + '/'

            s3Context.currentClient?.send(new PutObjectCommand({
                Bucket: s3Context.currentBucket.Name,
                Key: basePath + name + '/',
                Body: ""
            }))
                .then(() => {
                    notifications.show({
                        message: '创建目录成功',
                        icon: <IconCheck size="1.1rem" />,
                        color: 'green',
                        autoClose: 1000
                    })
                    refresh()
                })
                .catch((error) => {
                    console.log("创建文件目录失败", error);
                    notifications.show({
                        message: '创建目录失败',
                        icon: <IconX size="1.1rem" />,
                        color: 'red',
                        autoClose: 3000
                    })
                })

        }
    }
    //上传文件
    const uploadFileRef = useRef<() => void>(null);
    const uploadFile = (file: File) => {
        const basePath = directoryPath.split('/')
        basePath.pop()
        emitter.emit(UPLOADFILE, file, basePath.join('/') + '/' + file.name)
        uploadFileRef.current?.()
    }

    const [openedFolder, disclosureFolder] = useDisclosure(false);
    return (
        <>
            <Modal opened={openedFolder} onClose={disclosureFolder.close} title="创建目录" centered>
                <TextInput placeholder="目录名称(包含/将不能提交)" onKeyDown={(event) => {
                    const name = ((event.target as any).value as string)?.trim();
                    if (name && event.key === 'Enter' && name !== '' && !name.includes('/')) {
                        createDirectory(name)
                        disclosureFolder.close()
                    }
                }} />
            </Modal>
            {/* 上面是弹窗 */}
            <Button.Group style={{ marginBottom: '5px' }}>
                {/* 向左后退 */}
                <Button size="xs" variant="default" disabled ><IconArrowBigLeft size="1rem" /></Button>
                {/* 向右前进 */}
                <Button size="xs" variant="default" disabled><IconArrowBigRight size="1rem" /></Button>
                {/* 上一级 */}
                <Button size="xs" variant="default" onClick={topLevel}><IconArrowBigUp size="1rem" /></Button>
                {/* 路径 */}
                <Input size="xs" style={{ width: "700vh" }} placeholder="目录路径" ref={directoryPathRef} onKeyDown={(event) => event.key === 'Enter' ? updateDirectoryPath() : null} rightSection={<IconSearch size={14} stroke={1.5} />} />
                {/* 刷新 */}
                <Button size="xs" variant="default" onClick={() => refresh()}><IconRefresh size="1rem" /></Button>
                {/* 回到根目录 */}
                <Button size="xs" variant="default" onClick={toHome}><IconHome2 size="1rem" /></Button>
            </Button.Group>
            <Grid >
                <Grid.Col span={4}>
                    <Button.Group>
                        {/* 上传文件 */}
                        <FileButton resetRef={uploadFileRef} onChange={uploadFile} multiple={false}>
                            {(props) => <Button {...props} size="xs" variant="default"><IconFileUpload size="1rem" />上传</Button>}
                        </FileButton>
                        {/* 创建目录 */}
                        <Button size="xs" variant="default" onClick={disclosureFolder.open}><IconFolderPlus size="1rem" />创建目录</Button>
                    </Button.Group>
                </Grid.Col>
                {/* 当前目录搜索 */}
                <Grid.Col span={5}>
                    <Input size="xs" placeholder="当前目录搜索" ref={directorySearchRef} onKeyDown={(event) => event.key === 'Enter' ? updateDirectoryPath() : null} rightSection={<IconSearch size={14} stroke={1.5} />} />
                </Grid.Col>
                {/* 分页 */}
                <Grid.Col span={2} offset={1}>
                    <Flex
                        gap="md"
                        justify="flex-end"
                        align="flex-start"
                        direction="row"
                        wrap="wrap"
                    >
                        <Button.Group>
                            {/* todo 这个需要将每次下一页的token记录成一个栈，每次下一页就是入栈，上一页就是出栈 */}
                            <Button size="xs" variant="default" onClick={() => popTokenStack()}><IconChevronLeft size="1rem" /></Button>
                            <Button size="xs" variant="default" onClick={() => objects?.NextContinuationToken ? pushTokenStack(objects?.NextContinuationToken) : null}><IconChevronRight size="1rem" /></Button>
                        </Button.Group>
                    </Flex>

                </Grid.Col>
            </Grid>
            <div>
                <FileTable objects={objects} />
            </div>
        </>
    )
}
