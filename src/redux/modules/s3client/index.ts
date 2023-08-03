/* eslint-disable @typescript-eslint/no-empty-interface */
import { createSlice } from '@reduxjs/toolkit';
import { S3CLIENT } from '@/redux';
import { ipcRenderer } from 'electron';
import { S3ClientConfig } from '@aws-sdk/client-s3';

export interface S3ConfigBase{
    objectDelete:boolean
}
export interface S3Config{
    base:S3ConfigBase
}

interface State {
}

const initialState: State = {
}

export const s3ClientSlice = createSlice({
    name: S3CLIENT,
    initialState,
    reducers: {}
})
export interface S3ClientInfo extends S3ClientConfig {
    id:string;
    name:string;
}

//获取客户端列表
export const getS3Clients = ():Promise<S3ClientInfo[]> => {
    return ipcRenderer.invoke('getS3Clients')
}
//获取客户端列表
export const saveS3Client = (clientInfo:S3ClientInfo):Promise<boolean> => {
    return ipcRenderer.invoke('saveS3Client',clientInfo).then()
}
//删除客户端信息
export const deleteS3Client = (clientId:string):Promise<void> => {
    return ipcRenderer.invoke('deleteS3Client',clientId)
}
//修改客户端信息
export const updateS3Client = (client:S3ClientInfo):Promise<void> => {
    return ipcRenderer.invoke('updateS3Client',client)
}
//获取全部配置信息
export const getS3Config = ():Promise<S3Config> => {
    return ipcRenderer.invoke('getS3Config')
}
//开启或关闭对象删除
export const enableObjectDelete = (enable:boolean):Promise<void> =>{
    return ipcRenderer.invoke('enableObjectDelete',enable)
}

export default s3ClientSlice.reducer
