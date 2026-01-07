import React, { useEffect } from 'react'
import Header from '../header'
import { Outlet, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAppDispatch } from '@/redux/store'
import { useSelector } from 'react-redux'
import type { RootState } from '@/redux/rootReducer'
import { getMe } from '@/redux/user/userSlice'

type Props = {}

const Layout = (props: Props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const { role } = useSelector((state: RootState) => state.user);

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