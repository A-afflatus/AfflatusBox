import { PCFUNC,S3CLIENT } from '@/redux/constant';
import pcFunc from './pcfunc';
import s3client from './s3client';
export * from './pcfunc';
export * from './s3client';


const reducers = {
    [PCFUNC]:pcFunc,
    [S3CLIENT]:s3client

}

export default reducers