import React from 'react'
import Header from '../header'
import { Outlet } from 'react-router-dom'

type Props = {}

const Layout = (props: Props) => {
  return (
    <>
        <Header />

        <div className="flex max-w-7xl mx-auto mt-10"> {/* container */}
            <Outlet />
        </div>
    </>
  )
}

export default Layout