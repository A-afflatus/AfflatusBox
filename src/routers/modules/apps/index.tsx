import { CHATBOT,GITHUBHOTREPO,S3CLIENT } from '@/routers/constant';
import ChatRobot from '@/apps/chatrobot/index';
import S3Client from '@/apps/s3management';
import Giuhubhotrepo from '@/apps/githubhotrepo';
import { Route } from 'react-router-dom';
export default [
    <Route key={S3CLIENT} path={S3CLIENT} element={<S3Client />} />,
    <Route key={CHATBOT} path={CHATBOT} element={<ChatRobot />} />,
    <Route key={GITHUBHOTREPO} path={GITHUBHOTREPO} element={<Giuhubhotrepo />} />,
]