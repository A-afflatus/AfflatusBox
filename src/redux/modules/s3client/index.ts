import { createSlice } from '@reduxjs/toolkit';
import { S3CLIENT } from '@/redux';
import { ipcRenderer } from 'electron';
import { S3ClientConfig } from '@aws-sdk/client-s3';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface State {
}

const initialState: State = {
}

const s3ClientSlice = createSlice({
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

export default s3ClientSlice.reducer




