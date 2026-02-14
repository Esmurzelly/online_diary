import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button';
import { clearToken } from '@/redux/auth/authSlice';
import type { RootState } from '@/redux/rootReducer';
import { useAppDispatch } from '@/redux/store';
import { logOut } from '@/redux/user/userSlice';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RxAvatar, RxHamburgerMenu } from "react-icons/rx";
import { RxCross2 } from "react-icons/rx";
import Modal from '../modal';
import { FaHome, FaSchool } from 'react-icons/fa';
import NavItem from '../navItem';

const Header: React.FC = () => {
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
    <aside ref={headerRef} className={`md:sticky md:top-0 md:h-screen md:w-1/7 z-50 bg-primary-dark text-secondary-light ${isTopOfPage || showModal ? "opacity-100" : "opacity-95"}`}>
      <div className="mx-auto! h-full flex flex-col items-center justify-between px-5! py-3!">
        <nav className="hidden md:flex w-full font-inter text-center">
          <ul className='flex flex-col items-center gap-3 w-full'>
            {[
              ['Home', FaHome, '/'],
              ['My Profile', RxAvatar, '/profile'],
              ['School', FaSchool, '/school'],
            ].map(([title, icon, url]) => (
              <NavItem key={title} title={title} link={url} Icon={icon} />
            ))}
          </ul>
        </nav>

        <div className="flex w-full items-start md:hidden">
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
          {tokenValue && <Button className='w-[100px] cursor-pointer' onClick={handleLogOut}>Sign Out</Button>}
        </div>
      </div>

      <Modal showModal={showModal} setShowModal={setShowModal} tokenValue={tokenValue} handleLogOut={handleLogOut} />
    </aside>
  )
}

export default Header