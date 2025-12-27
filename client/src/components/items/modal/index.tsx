import React from 'react'
import { Link } from 'react-router-dom';

type Props = {
    showModal: boolean;
    setShowModal: (value: boolean) => void;
}

const Modal = ({ showModal, setShowModal }: Props) => {
    // get the name link and check which <li> is active

    return (
        <div className={`absolute text-center top-10 left-0 ${showModal ? 'translate-x-0' : "-translate-x-full"} transition-all w-full min-h-svh z-50 py-1! text-white bg-primary-dark`}>
            <div className="flex flex-col items-center px-5!">
                <nav className="w-full flex h-full items-center justify-center">
                    <ul className="flex flex-col items-center gap-3 w-full">
                        {[
                            ['Home', '/home'],
                            ['Profile', '/profile'],
                            ['School', '/school'],
                        ].map(([title, url]) => (
                            <Link
                                key={title}
                                className="flex hover:bg-white rounded-lg cursor-pointer w-full hover:text-black py-2!"
                                to={url}
                                onClick={() => setShowModal(false)}
                            >
                                {title}
                            </Link>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default Modal