import React, { useEffect } from 'react'
import Header from '../header'
import { Outlet } from 'react-router-dom'
import { useAppDispatch } from '@/redux/store'
import { useSelector } from 'react-redux'
import type { RootState } from '@/redux/rootReducer'
import { getMe } from '@/redux/user/userSlice'

const Layout: React.FC = () => {
  const dispatch = useAppDispatch();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(getMe());
    }
  }, [token]);

  return (
    <div className='bg-secondary-light w-screen min-h-screen flex flex-col md:flex-row font-inter gap-px'>
      <Header />

      <div className="flex flex-col items-start w-full overflow-x-scroll"> {/* container */}
        <Outlet />
      </div>
    </div>
  )
}

export default Layout