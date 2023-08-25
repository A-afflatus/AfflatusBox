import EventEmitter from 'events'


const emitter = new EventEmitter()
//选中客户端
export const UPDATECONFIG = 'UPDATECONFIG'
//刷新列表
export const REFRESH = 'REFRESH'
//选中回话
export const CHECKEDSESSION = 'CHECKEDSESSION'


export default emitter
