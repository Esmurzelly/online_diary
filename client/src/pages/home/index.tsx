import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { logOut } from '@/redux/user/studentSlice';
import { useAppDispatch } from '@/redux/store';
import { clearToken } from '@/redux/auth/authSlice';
import { useNavigate } from 'react-router-dom';

type Props = {}

const Home = (props: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const tokenValue = window.localStorage.getItem("access_token");

  const handleLogOut = () => {
    dispatch(logOut());
    dispatch(clearToken());
  }

  if (!tokenValue) {
    navigate('/auth')
  }

  return (
    <>
      <div>Home page</div>

      {tokenValue && <Button onClick={handleLogOut}>Log Out</Button>}
    </>
  )
}

export default Home