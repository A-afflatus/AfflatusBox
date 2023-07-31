//全局事件总线，单个功能模块的事件总线请在各自模块内部创建
import EventEmitter from 'events'

const emitter = new EventEmitter()

emitter.setMaxListeners(30)

export default emitter
