import React from 'react'
import Header from '../header'
import { Outlet, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ToastContainer } from 'react-toastify'

type Props = {}

const Layout = (props: Props) => {
  const navigate = useNavigate();

  return (
    <>
      <Header />

      <Button onClick={() => navigate('/home')}>Home</Button>

      <div className="flex flex-col items-start max-w-7xl mx-auto mt-10"> {/* container */}
        <h2>above the Outlet</h2>
        <Outlet />
      </div>
    </>
  )
}

export default Layout