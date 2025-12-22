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
    if(token) {
      dispatch(getMe());
    }
  }, [token]);

  return (
    <>
      <Header />

      <Button onClick={() => navigate('/home')}>Home</Button>
      <Button onClick={() => navigate('/profile')}>Profile</Button>
      <Button onClick={() => navigate('/school')}>School</Button>
      { role === 'student' && <Button onClick={() => navigate('/marks')}>Marks</Button> }

      <div className="flex flex-col items-start max-w-7xl mx-auto mt-10"> {/* container */}
        <h2>above the Outlet</h2>
        <Outlet />
      </div>
    </>
  )
}

export default Layout