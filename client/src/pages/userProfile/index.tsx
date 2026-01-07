import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { RootState } from '@/redux/rootReducer';
import { useAppDispatch } from '@/redux/store';
import { getUserById } from '@/redux/user/userSlice';
import type { User } from '@/types';
import React, { useEffect, useState } from 'react'
import { FaAddressBook } from 'react-icons/fa';
import { MdOutlineEmail, MdOutlineLocalPhone } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';

type Props = {}

const UserProfile = (props: Props) => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<User>();
  const { loading, message } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(getUserById({ id })).then(el => setUser(el.payload.user));
    if (message) toast(message);
  }, []);

  if (loading) {
    return <h1>Loading...</h1>
  }

  return (
    <div className='w-full h-screen flex flex-col items-center gap-3 font-inter px-8! py-3! overflow-x-hidden'>
      <h1>userProfile</h1>

      <div className="flex flex-col min-w-full text-xl items-center justify-between gap-2 bg-white rounded-2xl shadow-xl p-5!">
        {
          user?.avatarUrl
            ? <Avatar className='size-28'>
              <AvatarImage src={`http://localhost:3000${user?.avatarUrl}`} />
              <AvatarFallback>avatarUrl</AvatarFallback>
            </Avatar>
            : <div className="flex items-center justify-center uppercase text-white text-3xl bg-secondary-dark w-28 h-28 rounded-full">
              {user?.name ? user?.name.split('')[0] : "A"}
              {user?.name ? user?.surname.split('')[0] : "A"}
            </div>
        }
        <p>{user?.name} {user?.surname}</p>

        {/* <p className='bg-secondary-dark text-secondary-light px-4! py-1! rounded-3xl text-sm capitalize'>{user.role}</p> */}
        <p className='flex items-center gap-2 text-secondary-dark text-lg'><MdOutlineEmail /> {user?.email}</p>
        <p className='flex items-center gap-2 text-secondary-dark text-lg'><MdOutlineLocalPhone /> {user?.phone || "no phone"}</p>
        <p className='flex items-center gap-2 text-secondary-dark text-lg'><FaAddressBook /> {user?.address || "no address"}</p>
      </div>

      {/* <div className="bg-gray-500 flex flex-col gap-2">
        <span>name: {user?.name}</span>
        <span>surname: {user?.surname}</span>
        <span>email: {user?.email}</span>
        <span>phone: {user?.phone}</span>
        {user?.avatarUrl
          ?
          <img className='rounded-full w-40 h-40' src={`http://localhost:3000${user?.avatarUrl}`} alt="avatarUrl" />
          : "No Image"}
      </div> */}
    </div>
  )
}

export default UserProfile