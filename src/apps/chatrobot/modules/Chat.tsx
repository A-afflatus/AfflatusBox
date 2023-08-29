/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionIcon, Center, Flex, Space } from "@mantine/core";
import { IconAlertCircle, IconLayoutSidebar } from "@tabler/icons-react";
import DialogueContainer from "./DialogueContainer";
import Welcome from "../Welcome";
import SendInput from "./SendInput";
import { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from '../index';
import { ChatRobotSessionMessage, getChatRobotSessionMessageList, sendChatRobotMessage } from "@/redux";
import emitter, { SENDMESSAGE } from '../event';
import { nanoid } from "@reduxjs/toolkit";
import { useToggle } from "@mantine/hooks";
import { ipcRenderer } from "electron";
import { notifications } from "@mantine/notifications";
type Props = {
    open: () => void;
}
export default function Chat({ open }: Props) {
    const scrollRef = useRef(null);
    const context = useContext(ChatContext)
    const [flag, refresh] = useToggle([false, true])

    function scrollToBottom() {
        (scrollRef.current as any)?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
    useEffect(() => {
        scrollToBottom()
    })
    const [messageList, setMassageList] = useState<ChatRobotSessionMessage[]>([])
    useEffect(() => {
        //订阅响应
        const chatRobotReceive = (_: any, { sessionId }: { sessionId: string }) => {
            if (sessionId === context.currentSessionId) {
                refresh()
            }
        }
        const sendMessage = ({ sessionId, message }: { sessionId: string, message: string }) => {
            if (messageList.some((item) => item.type === 'loading')) {
                notifications.show({
                    message: '请等待上一条消息返回',
                    icon: <IconAlertCircle size="1.1rem" />,
                })
                return
            }
            //把消息添加到消息列表
            setMassageList([...messageList,
            {
                id: "a" + nanoid(),
                content: message,
                role: 'user',
            },
            {
                id: "a" + nanoid(),
                content: '思考中...',
                role: 'assistant',
                type: 'loading'
            }
            ])
            //发送消息ipc发送消息
            sendChatRobotMessage(sessionId, message)
        }
        emitter.on(SENDMESSAGE, sendMessage)
        //订阅响应
        ipcRenderer.on('ChatRobotReceiveSessionMessage', chatRobotReceive)
        return () => {
            emitter.off(SENDMESSAGE, sendMessage)
            ipcRenderer.off('ChatRobotReceiveSessionMessage', chatRobotReceive)
        }
    }, [messageList, flag, refresh, context.currentSessionId])
    useEffect(() => {
        if (context.currentSessionId) {
            getChatRobotSessionMessageList(context.currentSessionId)
                .then((res) => {
                    setMassageList(res.filter((item) => item.role !== 'system'))
                })
        } else {
            setMassageList([])
        }
    }, [context.currentSessionId, flag])
    return <div>
        <Flex
            w={'100%'}
            justify="center"
            align="center"
            direction="row"
            wrap="nowrap"
        >
            <ActionIcon style={{ border: '0.5px solid #4d4d4f', position: 'absolute', left: 20 }} size="lg" onClick={open} >
                <IconLayoutSidebar />
            </ActionIcon>
            <b>Chat Gpt 3.5-turbo-16k</b>
        </Flex>
        <hr />
        <div ref={scrollRef}>
            {
                context.currentSessionId && messageList.length > 0 ?
                    messageList.map((item) => <div key={item.id}>
                        <DialogueContainer message={item} />
                        <Space h={'5px'} />
                    </div>).concat(<div key="end" style={{ height: 30 }}></div>)
                    : <Welcome />
            }
        </div>
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
        }}>
            <Center
                w={'80%'}
                style={{
                    position: 'fixed',
                    bottom: 10,
                }}>
                <SendInput />
            </Center>
        </div>

    </div>
}
