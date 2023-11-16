import { IconBrandChrome, IconCirclePlus, IconPlayerPlayFilled, IconPlayerStopFilled, IconShield, IconTrashFilled, IconWorldOff } from '@tabler/icons-react';
import style from './header.module.css';
import { ActionIcon, Divider, Header, Tooltip } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';

export default function index() {
    const theme = useColorScheme();
    return (
        <Header height={31}>
            <div className={style.controlBar} style={{ backgroundColor: theme === 'dark' ? '#2A2C2E' : '#f2f2f2' }}>
                <div className={style.path} style={{ color: theme === 'dark' ? '#FFFFFF' : undefined }}>新建项目 / test / getUserInfo</div>
                <div className={style.buttonGroup}>
                    <div>
                        <Tooltip label="启动服务" position="bottom">
                            <ActionIcon variant="transparent" color='green'>
                                <IconPlayerPlayFilled />
                            </ActionIcon>
                        </Tooltip>
                    </div>
                    <div>
                        <Tooltip label="结束服务" position="bottom">
                            <ActionIcon variant="transparent" color='red'>
                                <IconPlayerStopFilled />
                            </ActionIcon>
                        </Tooltip>
                    </div>
                    <Divider orientation="vertical" />
                    <div>
                        <Tooltip label="开启跨域" position="bottom">
                            <ActionIcon variant="filled" color='yellow'>
                                <IconBrandChrome />
                            </ActionIcon>
                        </Tooltip>
                    </div>
                    <Divider orientation="vertical" />
                    <div>
                        <Tooltip label="添加服务" position="bottom">
                            <ActionIcon variant="transparent" color='blue'>
                                <IconCirclePlus />
                            </ActionIcon>
                        </Tooltip>
                    </div>
                    <div>
                        <Tooltip label="删除服务" position="bottom">
                            <ActionIcon variant="transparent" color='red'>
                                <IconTrashFilled />
                            </ActionIcon>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </Header>
    )
}
