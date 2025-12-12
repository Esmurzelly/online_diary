import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { RootState } from '@/redux/rootReducer';
import { useAppDispatch } from '@/redux/store';
import { getUserById } from '@/redux/user/userSlice';
import type { User } from '@/types';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify';

type Props = {}

const UserProfile = (props: Props) => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<User>();
  const { loading, message } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(getUserById({ id })).then(el => setUser(el.payload.user));
    if(message) toast(message);
  }, []);

  if(loading) {
    return <h1>Loading...</h1>
  }

  return (
    <div>
      <h1>userProfile</h1>

      <div className="bg-gray-500 flex flex-col gap-2">
        <span>name: {user?.name}</span>
        <span>surname: {user?.surname}</span>
        <span>email: {user?.email}</span>
        <span>phone: {user?.phone}</span>
        {user?.avatarUrl
          ?
          <img src={`http://localhost:3000${user?.avatarUrl}`} alt="avatarUrl" />
          : "No Image"}
      </div>
    </div>
  )
}

export default UserProfile