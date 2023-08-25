import { PCFUNC,S3CLIENT,CHATROBOT } from '@/redux/constant';
import pcFunc from './pcfunc';
import s3client from './s3client';
import chatrobot from './chatrobot';
export * from './pcfunc';
export * from './s3client';
export * from './chatrobot';


const reducers = {
    [PCFUNC]:pcFunc,
    [S3CLIENT]:s3client,
    [CHATROBOT]:chatrobot

}

export default reducers