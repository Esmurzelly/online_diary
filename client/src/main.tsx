import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import { persistor, store } from './redux/store.ts'
import { PersistGate } from 'redux-persist/integration/react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Auth from './pages/auth/index.tsx'
import Layout from './components/items/layout/layout.tsx'
import Home from './pages/home/index.tsx'
import { ToastContainer } from 'react-toastify'
import Profile from './pages/profile.tsx/index.tsx'
import 'react-toastify/dist/ReactToastify.css';

const router = createBrowserRouter([
  {
    path: '/auth',
    element: <Auth />
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: "/home",
        element: <Home />
      },
      {
        path: "/profile",
        element: <Profile />
      }
    ]
  }
])


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <RouterProvider router={router} />
        <ToastContainer />
      </PersistGate>
    </Provider>
  </StrictMode>,
)
