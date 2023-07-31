import { createSlice } from '@reduxjs/toolkit';
import { PCFUNC } from '@/redux/constant';
import { ipcRenderer } from 'electron';
import { ColorScheme } from '@mantine/core';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface State {
}

const initialState: State = {
}

const pcFuncSlice = createSlice({
    name: PCFUNC,
    initialState,
    reducers: {}
})
//退出应用
export const quitApp = () => {
    ipcRenderer.send('quitApp')
}
//默认浏览器打开网页
export const openUrl = (url: string) => {
    ipcRenderer.send('openUrl', url)
}
//获取系统色
export const getColorScheme = ():Promise<ColorScheme> => {
    return ipcRenderer.invoke('getThemeColors')
}

//更换系统色(目前只支持明暗切换)
export const toggleColorScheme = () => {
    ipcRenderer.send('SWITCH_THEME_COLORS')
}

export default pcFuncSlice.reducer




