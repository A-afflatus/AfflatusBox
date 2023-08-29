import App from './App';
import React, { useEffect, useState } from 'react';
import { getChatRobotConfig, saveChatRobotConfig, ChatRobotConfig } from '@/redux';
import emitter, { CHECKEDSESSION, UPDATECONFIG } from './event';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { useToggle } from '@mantine/hooks';
type AiContext = {
    currentSessionId?: string;
    currentOpenAiKey?: string;
    currentOpenAiBaseUrl?: string;
}
const initConfig = {}
export const ChatContext = React.createContext<AiContext>(initConfig);
export default function ChatRobot() {
    const [context, setContext] = useState<AiContext>(initConfig)
    const [flag, refresh] = useToggle([true, false])

    //加载配置
    useEffect(() => {
        //加载配置
        getChatRobotConfig()
            .then((res) => {
                setContext({
                    ...context,
                    currentOpenAiKey: res.openAiKey,
                    currentOpenAiBaseUrl: res.openAiBaseUrl
                })
            }).catch((err) => {
                console.log("加载机器人配置失败", err)
                alert("加载机器人配置失败")
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag])
    useEffect(() => {
        //更新配置
        const updeateConfig = (config: ChatRobotConfig) => {
            saveChatRobotConfig(config).then(() => {
                notifications.show({
                    message: '保存成功',
                    color: 'green',
                    icon: <IconCheck size="1.1rem" />,
                    autoClose: 2000
                })
                refresh()
            })
        }
        //选中客户端
        const checkedSession = (sessionId: string) => {
            setContext({
                ...context,
                currentSessionId: sessionId
            })
        }

        emitter.on(UPDATECONFIG, updeateConfig)
        emitter.on(CHECKEDSESSION, checkedSession)
        return () => {
            emitter.off(UPDATECONFIG, updeateConfig)
            emitter.off(CHECKEDSESSION, checkedSession)
        }
    }, [context, flag, refresh, setContext])

    return (
        <ChatContext.Provider value={context}>
            <App />
        </ChatContext.Provider>
    )
}