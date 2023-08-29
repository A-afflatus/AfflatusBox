/* eslint-disable @typescript-eslint/no-empty-interface */
import { createSlice } from '@reduxjs/toolkit';
import { CHATROBOT } from '@/redux';
import { ipcRenderer } from 'electron';

export type ChatRobotConfig = {
    openAiKey: string;
    openAiBaseUrl?: string;
}
export type ChatRobotSession = {
    id: string;
    name: string;
}

export type ChatRobotSessionMessage = {
    id: string;
    content: string | null;
    role: 'system' | 'user' | 'assistant';
    type?: 'loading';
}

interface State {
}

const initialState: State = {
}

export const chatrobotSlice = createSlice({
    name: CHATROBOT,
    initialState,
    reducers: {}
})

//获取机器人配置
export const getChatRobotConfig = (): Promise<ChatRobotConfig> => {
    return ipcRenderer.invoke('ChatRobotGetConfig')
}
//保存机器人配置
export const saveChatRobotConfig = (config: ChatRobotConfig): Promise<boolean> => {
    return ipcRenderer.invoke('ChatRobotSaveConfig', config).then()
}
//获取会话列表
export const getChatRobotSessionList = (): Promise<ChatRobotSession[]> => {
    return ipcRenderer.invoke('ChatRobotGetSessionList')
}
//修改会话名称
export const updateChatRobotSessionName = (id: string, name: string): Promise<boolean> => {
    return ipcRenderer.invoke('ChatRobotUpdateSessionName', { id, name }).then()
}
//新增会话
export const addChatRobotSession = (): Promise<boolean> => {
    return ipcRenderer.invoke('ChatRobotAddSession').then()
}
//删除会话
export const deleteChatRobotSession = (id: string): Promise<boolean> => {
    return ipcRenderer.invoke('ChatRobotDeleteSession', id).then()
}
//获取会话消息列表
export const getChatRobotSessionMessageList = (id: string): Promise<ChatRobotSessionMessage[]> => {
    return ipcRenderer.invoke('ChatRobotGetSessionMessageList', id)
}
//发送消息
export const sendChatRobotMessage = (sessionId: string, message: string) => {
    ipcRenderer.send('ChatRobotReceiveSessionMessage', { sessionId, message })
}
export default chatrobotSlice.reducer
