/* eslint-disable @typescript-eslint/no-explicit-any */
import { app, BrowserWindow, ipcMain, nativeTheme, shell } from 'electron'
import path from 'node:path'
import { SWITCH_THEME_COLORS, GET_THEME_COLORS, QUIT_APP, OPEN_URL } from './constant';
import settings from 'electron-settings'
import baseConfig from '../config.base.json';
import fs from 'fs';
import { initChatIpc } from './apps/chatrobot';
import { initS3ClientIpc } from './apps/s3client';

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
settings.configure({
  prettify:true
})
console.log("配置文件地址",settings.file());

if (!fs.existsSync(settings.file())) {
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

initChatIpc(ipcMain)
initS3ClientIpc(ipcMain)





