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
import Subjects from './pages/subjects/index.tsx'
import SubjectId from './pages/subjectId/index.tsx'
import MarksPage from './pages/marksPage/index.tsx'
import ClassPage from './pages/classPage/index.tsx'
import ProtectedRoute from './components/items/protectedRoute/index.tsx'

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
        element: (
          <ProtectedRoute allowRoles={["admin"]}>
            <School />
          </ProtectedRoute>
        )
      },
      {
        path: "/school/:id",
        element: <SchoolId />
      },
      {
        path: "/class/:id",
        element: (
          <ProtectedRoute allowRoles={["admin", "teacher"]}>
            <ClassPage />
          </ProtectedRoute>
        )
      },
      {
        path: "/subjects",
        element: (
          <ProtectedRoute allowRoles={["admin", "teacher"]}>
            <Subjects />
          </ProtectedRoute>
        )
      },
      {
        path: "/subject/:id",
        element: <SubjectId />
      },
      {
        path: "/marks",
        element: <MarksPage />
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
