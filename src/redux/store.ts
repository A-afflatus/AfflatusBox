import { configureStore } from '@reduxjs/toolkit'
import reducer from './modules';
//定义一个空的reducer
export const store = configureStore({
    reducer
})
// 推断state的类型
export type RootState = ReturnType<typeof store.getState>
// 推断dispatch的类型
export type AppDispatch = typeof store.dispatch
