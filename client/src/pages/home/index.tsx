import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { logOut } from '@/redux/user/userSlice';
import { useAppDispatch } from '@/redux/store';
import { clearToken } from '@/redux/auth/authSlice';
import { useNavigate } from 'react-router-dom';

type Props = {}

const Home = (props: Props) => {

  return (
    <>
      <div>Home page</div>

    </>
  )
}

export default Home