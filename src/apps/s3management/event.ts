import EventEmitter from 'events'


const emitter = new EventEmitter()
//选中客户端
export const PITCHS3CLIENT = 'PITCHS3CLIENT'
//选中bucket
export const PITCHBUCKET = 'PITCHBUCKET'
//进入文件目录
export const ENTERFOLDER = 'ENTERFOLDER'
//上传文件
export const UPLOADFILE = 'UPLOADFILE'
//刷新列表
export const REFRESH = 'REFRESH'
//初始化客户端页面
export const INITS3CLIENT = 'INITS3CLIENT'

export default emitter
