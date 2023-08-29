/* eslint-disable @typescript-eslint/no-explicit-any */
import settings from "electron-settings";
import { nanoid } from "@reduxjs/toolkit";
import OpenAI, { ClientOptions } from 'openai';

//配置key
const CONFIG_KEY = 'charRobotConfig'
const SESSION_LIST_KEY = CONFIG_KEY + '.charRobotSessionList'
const SESSION_MESSAGE_LIST_KEY = CONFIG_KEY + '.charRobotSessionMessageList'
const OPENAI_KEY = CONFIG_KEY + '.openAiKey'
const OPENAI_BASEURL = CONFIG_KEY + '.openAiBaseUrl'

//方法key
const SAVE_CONFIG = 'ChatRobotSaveConfig'
const GET_CONFIG = 'ChatRobotGetConfig'
const GET_SESSION_LIST = 'ChatRobotGetSessionList'
const UPDATE_SESSION_NAME = 'ChatRobotUpdateSessionName'
const ADD_SESSION = 'ChatRobotAddSession'
const DELETE_SESSION = 'ChatRobotDeleteSession'
const GET_SESSION_MESSAGE_LIST = 'ChatRobotGetSessionMessageList'
const SEND_SESSION_MESSAGE = 'ChatRobotReceiveSessionMessage'


export const initChatIpc = (ipcMain: Electron.IpcMain) => {
    //存配置
    ipcMain.handle(SAVE_CONFIG, async (_, conf) => {
        return settings.get(CONFIG_KEY)
            .then((config: any) => {
                const newConfig = {
                    ...config,
                    ...conf
                }
                return settings.setSync(CONFIG_KEY, newConfig)
            })
    });
    //加载配置
    ipcMain.handle(GET_CONFIG, async () => {
        return settings.get(CONFIG_KEY)
    });
    //获取会话列表
    ipcMain.handle(GET_SESSION_LIST, () => {
        return settings.get(SESSION_LIST_KEY).then((sessionList) => sessionList ?? [])
    })
    //修改会话名称
    ipcMain.handle(UPDATE_SESSION_NAME, (_, req: { id: string, name: string }) => {
        settings.get(SESSION_LIST_KEY).then((sessionList) => {
            const newSessionList = (sessionList as any[])?.map((item: any) => {
                if (item.id === req.id) {
                    return {
                        ...item,
                        name: req.name
                    }
                }
                return item
            })
            return settings.setSync(SESSION_LIST_KEY, newSessionList)
        })
            .then(() => true)
            .catch((e) => {
                console.log("修改回话名称失败", e);
                return false
            })

    })
    //新增回话
    ipcMain.handle(ADD_SESSION, () => {
        settings.get(SESSION_LIST_KEY).then((sessionList) => {
            const newSessionList = [...(sessionList as any[] ?? []), {
                id: "a" + nanoid(),
                name: '新的会话'
            }]
            return settings.setSync(SESSION_LIST_KEY, newSessionList)
        })
            .then(() => true)
            .catch((e) => {
                console.log("新增回话失败", e);
                return false
            })
    })
    //删除会话
    ipcMain.handle(DELETE_SESSION, (_, id: string) => {
        settings.get(SESSION_LIST_KEY).then((sessionList) => {
            const newSessionList = (sessionList as any[]).filter((item: any) => item.id !== id)
            return settings.setSync(SESSION_LIST_KEY, newSessionList)
        })
            .then(() => {
                //删除会话消息列表
                settings.unset(`${SESSION_MESSAGE_LIST_KEY}.${id}`)
                return true
            })
            .catch((e) => {
                console.log("删除回话失败", e);
                return false
            })
    })
    //获取会话消息列表
    ipcMain.handle(GET_SESSION_MESSAGE_LIST, (_, id: string) => {
        return settings.get(`${SESSION_MESSAGE_LIST_KEY}.${id}`)
            .then((sessionList) => {
                return sessionList ?? []
            })
    })
    //接收发送的消息
    ipcMain.on(SEND_SESSION_MESSAGE, (event, req: { sessionId: string, message: string }) => {
        settings.get(`${SESSION_MESSAGE_LIST_KEY}.${req.sessionId}`)
            .then((sessionList) => {
                const newSessionList = [...(sessionList as any[] ?? []), {
                    id: "a" + nanoid(),
                    content: req.message,
                    role: 'user',
                }, {
                    id: "a" + nanoid(),
                    content: '思考中...',
                    role: 'assistant',
                    type: 'loading'
                }]
                settings.setSync(`${SESSION_MESSAGE_LIST_KEY}.${req.sessionId}`, newSessionList)
                const openaiConf:ClientOptions = {
                    apiKey: settings.getSync(OPENAI_KEY)?.toString()??"",
                }
                //获取代理地址
                const baseUrl = settings.getSync(OPENAI_BASEURL)?.toString()??""
                if(baseUrl!==""){
                    openaiConf.baseURL = baseUrl
                }
                const openai = new OpenAI(openaiConf)
                openai.chat.completions.create({
                    model: "gpt-3.5-turbo-16k",
                    messages: newSessionList.filter(item => item?.type !== 'loading').map((item) => ({ role: item.role, content: item.content })),
                    stream: false,
                }).then((res) => {
                    console.log("消息响应", res.choices[0].message);
                    settings.setSync(`${SESSION_MESSAGE_LIST_KEY}.${req.sessionId}`,
                        newSessionList.filter(item => item?.type !== 'loading').concat({
                            id: "a" + nanoid(),
                            content: res.choices[0].message.content,
                            role: res.choices[0].message.role
                        }))
                    event.reply(SEND_SESSION_MESSAGE, { sessionId: req.sessionId, message: res.choices[0].message })
                }).catch((e) => {
                    console.log("发送消息失败", e);
                    settings.setSync(`${SESSION_MESSAGE_LIST_KEY}.${req.sessionId}`,
                        newSessionList.filter(item => item?.type !== 'loading').concat({
                            id: "a" + nanoid(),
                            content: e.message,
                            role: 'assistant'
                        }))
                    event.reply(SEND_SESSION_MESSAGE, { sessionId: req.sessionId, message: e.message })
                })
            })
    })
}