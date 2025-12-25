import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/redux/store'
import { googleAuth } from '@/redux/user/userSlice'
import { auth } from '@/firebase'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/button'
import { FaGoogle } from "react-icons/fa";

type Props = {
    role: "student" | "teacher" | "parent" | "admin" | "none"
}

const OAuth = ({ role }: Props) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();

        try {
            if (role === 'none') {
                toast.error("choose the role")
                return;
            }

            const result = await signInWithPopup(auth, provider);

            const res = await dispatch(googleAuth({
                name: result.user.displayName,
                email: result.user.email,
                role,
                avatar: result.user.photoURL,
            }));

            console.log('res from handle func client', res);

            navigate('/')
        } catch (error) {
            console.log(`error in handleGoogleClick - client ${error}`)
        }
    }

    return (
        <Button onClick={handleGoogleClick} type='button' className='px-4! py-6! mt-4! cursor-pointer w-full text-lg text-black bg-white border rounded-lg! hover:opacity-95'>
            <FaGoogle className='w-4'/>
            Continue with Google 
        </Button>
    )
}

export default OAuth