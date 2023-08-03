import { Box, Container, Divider, Group, LoadingOverlay, NavLink, ScrollArea, Switch, Text, useMantineTheme } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { getS3Config, enableObjectDelete, S3Config } from '@/redux';
import { useToggle } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';

export default function SettingsPage({ close }: { close: () => void }) {
    const theme = useMantineTheme();
    const [flag, refresh] = useToggle([true, false]);
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState<S3Config>()
    //获取配置
    useEffect(() => {
        setLoading(true)
        getS3Config()
            .then(setConfig)
            .catch(e => {
                console.log("获取s3配置失败", e);
                notifications.show({
                    message: '获取s3配置失败',
                    icon: <IconX size="1.1rem" />,
                    color: 'red'
                })
                close()
            }).finally(() => {
                setTimeout(() => {
                    setLoading(false)
                }, 300)
            })
    }, [close, flag])
    return (
        <div style={{ display: 'flex' }}>
            <Box w='20vh' h={'70vh'}>
                <ScrollArea h={'70vh'}>
                    <NavLink
                        label="基本配置"
                        defaultOpened
                    >
                    </NavLink>
                </ScrollArea>
            </Box>
            <div style={{ backgroundColor: '#ced4da', width: 1 }} />
            <Box w='100vh' h={'70vh'} pos="relative">
                <LoadingOverlay visible={loading} overlayBlur={2} />
                <ScrollArea h={'70vh'}>
                    <Container>
                        <Divider my="xs" label={<Text size='md' fw={700}>基本配置</Text>} labelPosition="center" />
                        <Group>
                            <Switch
                                defaultChecked={config?.base.objectDelete}
                                checked={config?.base.objectDelete}
                                onChange={(event) => enableObjectDelete(event.currentTarget.checked).finally(refresh)}
                                color="teal"
                                labelPosition="left"
                                size="md"
                                label={<Text size={15}>对象删除</Text>}
                                thumbIcon={
                                    config?.base.objectDelete ? (
                                        <IconCheck size="0.8rem" color={theme.colors.teal[theme.fn.primaryShade()]} stroke={3} />
                                    ) : (
                                        <IconX size="0.8rem" color={theme.colors.red[theme.fn.primaryShade()]} stroke={3} />
                                    )
                                }
                            />
                        </Group>
                    </Container>
                </ScrollArea>
            </Box>
        </div>
    );
}