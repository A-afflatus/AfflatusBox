/* eslint-disable @typescript-eslint/no-explicit-any */
import { app, BrowserWindow, ipcMain, nativeTheme, shell } from 'electron'
import path from 'node:path'
import { SWITCH_THEME_COLORS, GET_THEME_COLORS, QUIT_APP, OPEN_URL, GET_S3_CLIENTS, SAVE_S3_CLIENTS, DELETE_S3_CLIENT, UPDATE_S3_CLIENT, GET_S3_CONFIG, ENABLE_OBJECT_DELETE } from './constant';
import settings from 'electron-settings'
import baseConfig from '../config.base.json';
import fs from 'fs';

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.PUBLIC, 'afflatus-logo.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: false,
      nodeIntegration: true,
      webSecurity: false,
    },
  })

  // 设置窗口的最小尺寸
  win.setMinimumSize(800, 700);
  win.setSize(1200, 800)
  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}
nativeTheme.themeSource = 'light'
app.on('window-all-closed', () => {
  win = null
})

app.whenReady().then(createWindow)

// 使用默认设置，setting.json
// settings.configure({})

if(!fs.existsSync(settings.file())){
  console.log("初始化配置");
  settings.set(baseConfig)
}

//! 自定义事件

// 切换主题颜色
ipcMain.on(SWITCH_THEME_COLORS, () => {
  if (nativeTheme.shouldUseDarkColors) {
    nativeTheme.themeSource = 'light'
  } else {
    nativeTheme.themeSource = 'dark'
  }
  return nativeTheme.shouldUseDarkColors
})
// 获取主题颜色
ipcMain.handle(GET_THEME_COLORS, async () => {
  return nativeTheme.themeSource
})

//默认浏览器打开网页

ipcMain.on(OPEN_URL, (_event, url) => {
  shell.openExternal(url)
})

//退出程序
ipcMain.on(QUIT_APP, () => {
  app.quit()
})


// 获取s3客户端列表
ipcMain.handle(GET_S3_CLIENTS, async () => {
  return settings.get('s3clients')
});

//新增s3客户端
ipcMain.handle(SAVE_S3_CLIENTS, async (_, clientInfo) => {
  try {
    const s3clients: any = await settings.get('s3clients')??[]
    await settings.set('s3clients', [...s3clients, {
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
    const s3clients: any = await settings.get('s3clients')??[]
    return settings.set('s3clients', [...(s3clients.filter((item: any)=>item.id !== clientId))])
});
//删除s3客户端
ipcMain.handle(UPDATE_S3_CLIENT, async (_, client) => {
    const s3clients: any = await settings.get('s3clients')??[]
    const targetClient = s3clients.filter((item: any)=>item.id === client.id).shift()
    if(targetClient){
      targetClient.name = client.name
      targetClient.forcePathStyle = client.forcePathStyle
      return settings.set('s3clients', [...(s3clients.filter((item: any)=>item.id !== client.id)),targetClient])
    }
    console.log("没找到需要修改客户端",JSON.stringify(client));
    return null  
});
//获取全部配置信息
ipcMain.handle(GET_S3_CONFIG, async () => {
  return settings.get('s3Config')
});
//开启或关闭对象删除
ipcMain.handle(ENABLE_OBJECT_DELETE, async (_, enable) => {
  return settings.set('s3Config.base.objectDelete',enable)
});