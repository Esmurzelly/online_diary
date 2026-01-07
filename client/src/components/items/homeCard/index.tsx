import React from 'react'
import type { IconType } from 'react-icons'
import { LiaUniversitySolid } from 'react-icons/lia'

type Props = {
    Icon: IconType,
    text: string, 
    description: string
}

const HomeCard = ({ Icon, text, description }: Props) => {
    return (
        <div className="w-full sm:w-[200px] sm:h-[250px] flex grow flex-col items-start justify-between sm:justify-start gap-3 bg-white rounded-2xl shadow-xl py-3! px-5!">
            <Icon className='w-12 h-12 bg-primary-light text-secondary-light rounded-lg p-2!' />
            <div className="flex flex-col items-start gap-1">
                <h1 className='text-xl font-medium'>{text}</h1>
                <p className='text-black/75'>{description}</p>
            </div>
        </div>
    )
}

export default HomeCard