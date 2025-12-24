import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/redux/store'
import { googleAuth } from '@/redux/user/userSlice'
import { app, auth } from '@/firebase'
import { signInWithPopup, GoogleAuthProvider, getAuth } from 'firebase/auth';
import { toast } from 'react-toastify'

type Props = {
    role: "student" | "teacher" | "parent" | "admin" | "none"
}

const OAuth = ({ role }: Props) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        // provider.setCustomParameters({ prompt: "select_account" });

        try {
            if(role === 'none') {
                toast.error("choose the error")
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
        <button onClick={handleGoogleClick} type='button' className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
            Continue with Google
        </button>
    )
}

export default OAuth