import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { RxCross2 } from "react-icons/rx";
import { FaHome } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { FaSchool } from "react-icons/fa6";
import { MdSchool } from "react-icons/md";
import { FaBook } from "react-icons/fa";
import { Button } from '@/components/ui/button';
import { IoMdExit } from "react-icons/io";

type Props = {
    showModal: boolean;
    setShowModal: (value: boolean) => void;
    tokenValue: string | null;
    handleLogOut: () => void
}

const Modal = ({ showModal, setShowModal, tokenValue, handleLogOut }: Props) => {
    const location = useLocation();

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setShowModal(false);
            }
        };

        if (showModal) {
            window.addEventListener("keydown", onKeyDown);
        }

        return () => window.removeEventListener("keydown", onKeyDown);
    }, [showModal]);

    return (
        <div className={`absolute font-inter text-secondary-light text-center h-screen top-0 ${showModal ? '-translate-x-10' : "-translate-x-[200%]"} transition-all w-full min-h-svh z-20 py-1! bg-primary-dark`}>
            <div className="w-full h-full flex flex-col px-16!">
                <div className="flex md:hidden">
                    <RxCross2
                        className="w-7 mt-2! cursor-pointer"
                        onClick={() => setShowModal(false)}
                    />
                </div>

                <div className="flex flex-row items-center text-left gap-2">
                    <img className='w-16' src="/logo.png" alt="logo" />

                    <div className="flex flex-col gap-1">
                        <p className='font-semibold'>Online diary</p>
                        <p className='text-xs'>School management</p>
                    </div>
                    <div className='absolute top-22 left-0 w-full my-4! h-px opacity-75 bg-secondary-light'></div>
                </div>

                <nav className="w-full h-full flex items-start justify-between mt-8!">
                    <ul className="flex flex-col items-center gap-3 w-full">
                        {[
                            ['Home', '/', <FaHome />],
                            ['My Profile', '/profile', <CgProfile />],
                            ['School', '/school', <FaSchool />],
                        ].map(([title, url, icon]) => (
                            <Link
                                key={title}
                                className={`flex items-center gap-3 p-4! hover:bg-white rounded-lg cursor-pointer w-full hover:text-black py-2! ${location.pathname === url ? "bg-primary-light! text-black shadow-lg shadow-secondary-light/30" : ""}`}
                                to={url}
                                onClick={() => setShowModal(false)}
                            >
                                {icon} {title}
                            </Link>
                        )
                        )}
                    </ul>
                </nav>

                <div className="flex flex-col items-start p-4!">
                    <div className='absolute bottom-15 left-0 w-full my-4! h-px opacity-75 bg-secondary-light'></div>
                    {tokenValue &&
                        <Button variant={'ghost'} className='w-[100px]' onClick={handleLogOut}>
                            <IoMdExit />
                            Log Out
                        </Button>}
                </div>

            </div>
        </div>
    )
}

export default Modal