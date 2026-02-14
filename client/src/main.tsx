import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import { persistor, store } from './redux/store.ts'
import { PersistGate } from 'redux-persist/integration/react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/items/layout/layout.tsx'
import ProtectedRoute from './components/items/protectedRoute/index.tsx'
import Loader from './components/items/Loader/index.tsx'

const AuthComponent = lazy(() => import('@/pages/auth/index.tsx'));
const UserProfileComponent = lazy(() => import('@/pages/userProfile/index.tsx'));
const HomeComponent = lazy(() => import('@/pages/home/index.tsx'));
const ProfileComponent = lazy(() => import('@/pages/profile/index.tsx'));
const SchoolComponent = lazy(() => import('@/pages/school/index.tsx'));
const SchoolIdComponent = lazy(() => import('@/pages/SchoolId/index.tsx'));
const SubjectsComponent = lazy(() => import('@/pages/subjects/index.tsx'));
const SubjectIdComponent = lazy(() => import('@/pages/subjectId/index.tsx'));
const MarkPageComponent = lazy(() => import('@/pages/marksPage/index.tsx'));
const ClassPageComponent = lazy(() => import('@/pages/classPage/index.tsx'));

const router = createBrowserRouter([
  {
    path: '/auth',
    element: <Suspense fallback={<Loader />}>
      <AuthComponent />
    </Suspense>
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Suspense fallback={<Loader />}>
          <HomeComponent />
        </Suspense>
      },
      {
        path: "/profile",
        element: <Suspense fallback={<Loader />}>
          <ProfileComponent />
        </Suspense>
      },
      {
        path: "/profile/:id",
        element: <Suspense fallback={<Loader />}>
          <UserProfileComponent />
        </Suspense>
      },
      {
        "path": "/school",
        element: (
          <ProtectedRoute allowRoles={["admin"]}>
            <Suspense fallback={<Loader />}>
              <SchoolComponent />
            </Suspense>
          </ProtectedRoute>
        )
      },
      {
        path: "/school/:id",
        element: <Suspense fallback={<Loader />}>
          <SchoolIdComponent />
        </Suspense>
      },
      {
        path: "/class/:id",
        element: <Suspense fallback={<Loader />}>
          <ClassPageComponent />
        </Suspense>
      },
      {
        path: "/subjects",
        element: (
          <ProtectedRoute allowRoles={["admin", "teacher"]}>
            <Suspense fallback={<Loader />}>
              <SubjectsComponent />
            </Suspense>
          </ProtectedRoute>
        )
      },
      {
        path: "/subject/:id",
        element: (
          <ProtectedRoute allowRoles={["admin", "teacher"]}>
            <Suspense fallback={<Loader />}>
              <SubjectIdComponent />
            </Suspense>
          </ProtectedRoute>
        )
      },
      {
        path: "/marks",
        element: <Suspense fallback={<Loader />}>
          <MarkPageComponent />
        </Suspense>
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
