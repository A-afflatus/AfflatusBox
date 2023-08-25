/* eslint-disable @typescript-eslint/no-explicit-any */
import settings from "electron-settings";
//配置key
const CONFIG_KEY = 's3Config'
const BASE = CONFIG_KEY + '.base'
const OBJETC_DELETE = BASE + '.objectDelete'
const S3_CLIENTS = CONFIG_KEY + '.s3clients'

//获取s3客户端列表
const GET_S3_CLIENTS = 'getS3Clients'
//新增s3客户端
const SAVE_S3_CLIENTS = 'saveS3Client'
//删除s3客户端
const DELETE_S3_CLIENT = 'deleteS3Client'
//修改客户端
const UPDATE_S3_CLIENT = 'updateS3Client'
//获取全局配置
const GET_S3_CONFIG='getS3Config'
//变更对象删除开关
const ENABLE_OBJECT_DELETE='enableObjectDelete'
export const initS3ClientIpc = (ipcMain: Electron.IpcMain) => {
  // 获取s3客户端列表
  ipcMain.handle(GET_S3_CLIENTS, async () => {
    return settings.get(S3_CLIENTS)
  });

  //新增s3客户端
  ipcMain.handle(SAVE_S3_CLIENTS, async (_, clientInfo) => {
    try {
      const s3clients: any = await settings.get(S3_CLIENTS) ?? []
      await settings.set(S3_CLIENTS, [...s3clients, {
        ...clientInfo
      }])
      return true
    } catch (error) {
      console.log("添加s3客户端失败", error);
      return false
    }
  });
  //删除s3客户端
  ipcMain.handle(DELETE_S3_CLIENT, async (_, clientId) => {
    const s3clients: any = await settings.get(S3_CLIENTS) ?? []
    return settings.set(S3_CLIENTS, [...(s3clients.filter((item: any) => item.id !== clientId))])
  });
  //删除s3客户端
  ipcMain.handle(UPDATE_S3_CLIENT, async (_, client) => {
    const s3clients: any = await settings.get(S3_CLIENTS) ?? []
    const targetClient = s3clients.filter((item: any) => item.id === client.id).shift()
    if (targetClient) {
      targetClient.name = client.name
      targetClient.forcePathStyle = client.forcePathStyle
      return settings.set(S3_CLIENTS, [...(s3clients.filter((item: any) => item.id !== client.id)), targetClient])
    }
    console.log("没找到需要修改客户端", JSON.stringify(client));
    return null
  });
  //获取全部配置信息
  ipcMain.handle(GET_S3_CONFIG, async () => {
    return settings.get(CONFIG_KEY)
  });
  //开启或关闭对象删除
  ipcMain.handle(ENABLE_OBJECT_DELETE, async (_, enable) => {
    return settings.set(OBJETC_DELETE, enable)
  });
}