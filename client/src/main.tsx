import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import { persistor, store } from './redux/store.ts'
import { PersistGate } from 'redux-persist/integration/react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Auth from './pages/auth/index.tsx'
import Layout from './components/items/layout/layout.tsx'
import UserProfile from './pages/userProfile/index.tsx'
import Home from './pages/home/index.tsx'
import { ToastContainer } from 'react-toastify'
import Profile from './pages/profile.tsx/index.tsx'
import 'react-toastify/dist/ReactToastify.css';
import School from './pages/school/index.tsx'
import SchoolId from './pages/SchoolId/index.tsx'
import ClassPage from './pages/ClassPage/index.tsx'

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
        element: <Profile />,
      },
      {
        path: "/profile/:id",
        element: <UserProfile />
      },
      {
        "path": "/school",
        element: <School />
      },
      {
        path: "/school/:id",
        element: <SchoolId />
      },
      {
        path: "/class/:id",
        element: <ClassPage />
      },
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
