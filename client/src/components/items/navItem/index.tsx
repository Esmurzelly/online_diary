import React from 'react'
import type { IconType } from 'react-icons'
import { Link } from 'react-router-dom'

type Props = {
    title: string,
    link: string,
    Icon: IconType
}

const NavItem = ({ title, link, Icon }: Props) => {
    return (
        <Link
            key={title}
            className="flex items-center gap-2 hover:bg-white rounded-lg cursor-pointer w-full hover:text-black p-2!"
            to={link}
        >
            <Icon className='w-4 h-4' />
            {title}
        </Link>
    )
}

export default NavItem