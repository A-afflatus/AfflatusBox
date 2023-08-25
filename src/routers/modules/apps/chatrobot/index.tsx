import { CHATBOT } from '@/routers/constant';
import ChatRobot from '@/apps/chatrobot/index';
import { Route } from 'react-router-dom';

export default
    <Route key={CHATBOT} path={CHATBOT} element={<ChatRobot />} />

