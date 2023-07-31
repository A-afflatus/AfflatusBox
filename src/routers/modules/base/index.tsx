import { Route } from 'react-router-dom';
import { APPS, SETTING } from '@/routers/constant';
import Apps from '@/pages/appsmenu';
import Setting from '@/pages/settings';
import appsRouters from '../apps'
export default [
    //设置
    <Route key={SETTING} path={SETTING} element={<Setting />} />,
    //应用集合
    <Route key={APPS} path={APPS} element={<Apps />} />,
    //S3Client
    ...appsRouters
]