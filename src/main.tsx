import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux';
import routers from '@/routers';
import {store} from '@/redux';
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <Provider store={store}>
        <RouterProvider router={routers} />
    </Provider>,
)


postMessage({ payload: 'removeLoading' }, '*')
