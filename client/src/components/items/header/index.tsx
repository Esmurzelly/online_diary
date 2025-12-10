import { Button } from '@/components/ui/button';
import { clearToken } from '@/redux/auth/authSlice';
import type { RootState } from '@/redux/rootReducer';
import { useAppDispatch } from '@/redux/store';
import { logOut } from '@/redux/user/userSlice';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

type Props = {}

const Header = (props: Props) => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const role = useSelector((state: RootState) => state.user.role);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const tokenValue = window.localStorage.getItem("access_token");

  const handleLogOut = () => {
    dispatch(logOut());
    dispatch(clearToken());

    navigate('/auth')
  }

  useEffect(() => {
    if (!tokenValue) {
      navigate('/auth')
    }
  }, [tokenValue])

  return (
    <div className='flex flex-row w-screen justify-between'>
      <h1>Header</h1>

      <div className="user flex flex-row gap-1 items-center">
        <p>name: {currentUser?.name}</p>
        <p>surname: {currentUser?.surname}</p>
        <p>email: {currentUser?.email}</p>
        <p>role: {role}</p>

        <div className="">
          {tokenValue && <Button className='w-[100px]' onClick={handleLogOut}>Log Out</Button>}
        </div>
      </div>

    </div>
  )
}

export default Header