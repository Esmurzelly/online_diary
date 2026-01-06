import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button';
import { clearToken } from '@/redux/auth/authSlice';
import type { RootState } from '@/redux/rootReducer';
import { useAppDispatch } from '@/redux/store';
import { logOut } from '@/redux/user/userSlice';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross2 } from "react-icons/rx";
import Modal from '../modal';
import { useLocation } from 'react-router-dom';

type Props = {}

const Header = (props: Props) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isTopOfPage, setIsTopOfPage] = useState<boolean>(true);
  const headerRef = useRef<HTMLDivElement>(null);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const role = useSelector((state: RootState) => state.user.role);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const tokenValue = window.localStorage.getItem("access_token");

  // const toggleModal = () => setShowModal(state => !state);
  const toggleModal = () => setShowModal(!showModal);

  const handleLogOut = () => {
    dispatch(logOut());
    dispatch(clearToken());

    navigate('/auth')
  }

  useEffect(() => {
    if (!tokenValue) {
      navigate('/auth')
    }
  }, [tokenValue]);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", showModal);
    document.body.classList.toggle("overflow-auto", !showModal);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsTopOfPage(!entry.isIntersecting) // !если элемент является наблюдаемым
      },
      { threshold: [0] }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => {
      if (headerRef.current) {
        observer.unobserve(headerRef.current)
      }
    }
  }, [showModal, headerRef])

  return (
    <section ref={headerRef} className={`fixed top-0 left-0 z-50 w-full ${isTopOfPage ? "bg-primary-dark" : "bg-secondary-light"} text-primary-dark ${isTopOfPage || showModal ? "opacity-100" : "opacity-95"}`}>
      <div className="max-w-screen-2xl mx-auto! flex flex-row items-center justify-between px-5! py-3!">
        <nav className="hidden md:flex w-2/3 font-inter text-center">
          <ul className='flex flex-row items-center gap-3 w-full'>
            {[
              ['Home', '/'],
              ['Profile', '/profile'],
              ['School', '/school'],
            ].map(([title, url]) => (
              <Link
                key={title}
                className="flex hover:bg-white rounded-lg cursor-pointer w-full hover:text-black py-2!"
                to={url}
              >
                {title}
              </Link>
            ))}
          </ul>
        </nav>

        <div className="flex md:hidden">
          {showModal ? (
            <RxCross2
              className="w-7 cursor-pointer"
              onClick={toggleModal}
            />
          ) : (
            <RxHamburgerMenu
              className="w-7 cursor-pointer"
              onClick={toggleModal}
            />
          )}
        </div>

        <div className="hidden md:flex flex-row gap-1 items-center">
          <span>name: {currentUser?.name}</span>
          <span>surname: {currentUser?.surname}</span>
          <span>email: {currentUser?.email}</span>
          <span>role: {role}</span>

          {tokenValue && <Button className='w-[100px]' onClick={handleLogOut}>Log Out</Button>}
        </div>
      </div>

      <Modal showModal={showModal} setShowModal={setShowModal} tokenValue={tokenValue} handleLogOut={handleLogOut} />
    </section>
  )
}

export default Header