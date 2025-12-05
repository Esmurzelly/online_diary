import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { persistor, store } from './app/store/store.ts'
import { PersistGate } from 'redux-persist/integration/react'
import { createBrowserRouter } from 'react-router-dom'
import Auth from './pages/auth/index.tsx'
import Layout from './components/items/layout/layout.tsx'


const router = createBrowserRouter([
  {
    path: '/auth',
    element: <Auth />
  },
  {
    path: '/',
    element: <Layout />,
    // children: [
    //   {
    //     path: ""
    //   }
    // ]
  }
])


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PersistGate persistor={persistor}>
      <Provider store={store}>
        <App />
      </Provider>
    </PersistGate>
  </StrictMode>,
)
