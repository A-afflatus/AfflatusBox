import EventEmitter from 'events'


const emitter = new EventEmitter()
const base = 'CHATROBOT'
//选中客户端
export const UPDATECONFIG = base+'UPDATECONFIG'
//刷新列表
export const REFRESH = base+'REFRESH'
//选中回话
export const CHECKEDSESSION = base+'CHECKEDSESSION'
//发送消息
export const SENDMESSAGE = base+'SENDMESSAGE'


export default emitter
