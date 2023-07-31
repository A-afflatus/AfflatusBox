import { Navigate, NavigateFunction, Route,  createHashRouter, createRoutesFromElements } from 'react-router-dom';
import Welcome from '@/pages/Welcome.tsx';
import App from '@/App.tsx';
import { HOME, WELCOME } from './constant';
import RouterConfig from './modules';
import {openUrl} from '@/redux';

const router = createHashRouter(
    createRoutesFromElements(
        <Route path={HOME} element={<App />}>
            <Route path={WELCOME} element={<Welcome />} />
            {...RouterConfig}
            {/* 兜底跳转 */}
            <Route path={HOME} element={<Navigate to={WELCOME} />} />
        </Route>
    )
)
type GoToRoute = {
    route:string
    navigate:NavigateFunction
}

export const toLink = (link:string | GoToRoute)=>{
    if(typeof link === 'string'){
        openUrl(link)
    }else{
        link.navigate(link.route)
    }
}

export default router;