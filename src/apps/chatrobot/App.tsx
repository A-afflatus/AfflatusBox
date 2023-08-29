import { ActionIcon, AppShell, Button,  Flex, Navbar, ScrollArea, Space, Text } from '@mantine/core';
import { IconLayoutSidebar, IconPlus } from '@tabler/icons-react';
import SessionItem from './modules/SessionItem';
import FooterTool from './modules/FooterTool';
import { useDisclosure, useToggle } from '@mantine/hooks';
import { useContext, useEffect, useState } from 'react';
import { getChatRobotSessionList, ChatRobotSession, addChatRobotSession } from '@/redux';
import emitter, { CHECKEDSESSION } from './event';
import { ChatContext } from './index';
import Chat from './modules/Chat';
export default function ChatRobot() {
    const context = useContext(ChatContext)
    const [opend, { open, close }] = useDisclosure(true)
    const [sessionList, setSessionList] = useState<ChatRobotSession[]>([])
    const [flag, refresh] = useToggle([false, true])
    //获取会话列表
    useEffect(() => {
        getChatRobotSessionList().then((res) => {
            setSessionList(res)
        })
    }, [flag])
    return (
        <AppShell
            navbar={
                opend ?
                    <Navbar p="xs" width={{ base: '230px' }} style={{ backgroundColor: '#25262b' }}>
                        <Navbar.Section>
                            <Flex
                                gap="xs"
                                justify="flex-start"
                                align="center"
                                direction="row"
                                wrap="nowrap"
                            >
                                <Button style={{ border: '0.5px solid #4d4d4f' }} color={'dark'} w={'83%'} leftIcon={<IconPlus size="1rem" />}
                                    onClick={() => { addChatRobotSession(); refresh() }}
                                >
                                    新的聊天
                                </Button>
                                <ActionIcon style={{ border: '0.5px solid #4d4d4f' }} w={'17%'} variant="filled" size="lg" color='dark' onClick={close}>
                                    <IconLayoutSidebar />
                                </ActionIcon>
                            </Flex>
                        </Navbar.Section>
                        <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
                            <Space h="xs" />
                            <Text color='#8e8e9f' size='xs'>会话列表</Text>
                            {
                                sessionList.map((item) =>
                                    <div key={item.id} onClick={() => emitter.emit(CHECKEDSESSION, item.id)}>
                                        <SessionItem session={item} refresh={refresh}
                                            hoverOrClick={item.id === context.currentSessionId}
                                        />
                                    </div>
                                )
                            }
                        </Navbar.Section>

                        <Navbar.Section>
                            <hr color='#4d4d4f' />
                            <Flex
                                gap="xs"
                                direction="column"
                                wrap="nowrap"
                            >
                                <FooterTool name='设置' />
                            </Flex>
                        </Navbar.Section>
                    </Navbar>
                    : <></>
            }
        >
            <Chat open={open} />
        </AppShell>
    )
}