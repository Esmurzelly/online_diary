import React, { useEffect, useState } from 'react';
import ButtonMailto from '@/components/items/buttonMailTo';
import ButtonPhoneTo from '@/components/items/buttonPhoneTo';
import Loader from '@/components/items/Loader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { RootState } from '@/redux/rootReducer';
import { useAppDispatch } from '@/redux/store';
import { getUserById } from '@/redux/user/userSlice';
import type { User } from '@/types';
import { FaAddressBook } from 'react-icons/fa';
import { MdOutlineEmail, MdOutlineLocalPhone } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify';

const UserProfile: React.FC = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<User>();
  const { loading, message } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // @ts-ignore
    dispatch(getUserById({ id })).then(el => setUser(el?.payload?.user));
    // if (message) toast(message);
  }, []);

  if (loading || !user) {
    return <Loader />
  }

  return (
    <div className='w-full h-screen flex flex-col items-center gap-3 font-inter px-8! py-3! overflow-x-hidden'>
      <h1>User profile</h1>

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

        <ButtonMailto Icon={MdOutlineEmail} label={user?.email || "no email"} mailto={`mailto:${user!.email}`} />
        <ButtonPhoneTo Icon={MdOutlineLocalPhone} label={user?.phone || "no phone"} tel={`tel:${user?.phone}`} />
        <p className='flex items-center gap-2 text-secondary-dark text-lg'><FaAddressBook /> {user?.address || "no address"}</p>
      </div>
    </div>
  )
}

export default UserProfile