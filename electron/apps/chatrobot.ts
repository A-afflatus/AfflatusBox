/* eslint-disable @typescript-eslint/no-explicit-any */
import settings from "electron-settings";
import { nanoid } from "@reduxjs/toolkit";


//配置key
const CONFIG_KEY = 'charRobotConfig'
const SESSION_LIST_KEY = CONFIG_KEY+'.charRobotSessionList'

//方法key
const SAVE_CONFIG = 'ChatRobotSaveConfig'
const GET_CONFIG = 'ChatRobotGetConfig'
const GET_SESSION_LIST = 'ChatRobotGetSessionList'
const UPDATE_SESSION_NAME = 'ChatRobotUpdateSessionName'
const ADD_SESSION = 'ChatRobotAddSession'
const DELETE_SESSION = 'ChatRobotDeleteSession'

export const initChatIpc = (ipcMain: Electron.IpcMain) => {
    //存配置
    ipcMain.handle(SAVE_CONFIG, async (_, conf) => {
        return settings.get(CONFIG_KEY)
            .then((config: any) => {
                const newConfig = {
                    ...config,
                    ...conf
                }
                return settings.set(CONFIG_KEY, newConfig)
            })
    });
    //加载配置
    ipcMain.handle(GET_CONFIG, async () => {
        return settings.get(CONFIG_KEY)
    });
    //获取会话列表
    ipcMain.handle(GET_SESSION_LIST, () => {
        return settings.get(SESSION_LIST_KEY).then((sessionList) => sessionList??[])
    })
    //修改会话名称
    ipcMain.handle(UPDATE_SESSION_NAME, (_, req: { id: string, name: string }) => {
        settings.get(SESSION_LIST_KEY).then((sessionList) => {
            const newSessionList =(sessionList as any[])?.map((item: any) => {
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
            const newSessionList = [...(sessionList as any[]??[]), {
                id: nanoid(),
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
    ipcMain.handle(DELETE_SESSION, (_,id:string) => {
        settings.get(SESSION_LIST_KEY).then((sessionList) => {
            const newSessionList = (sessionList as any[]).filter((item: any) => item.id !== id)
            return settings.setSync(SESSION_LIST_KEY, newSessionList)
        })
        .then(() => true)
        .catch((e) => {
            console.log("删除回话失败", e);
            return false
        })
    })


}
