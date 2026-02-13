import React from "react";
import { Link } from "react-router-dom";
import type { IconType } from "react-icons";

type Props = {
    tel: string;
    label: string;
    Icon: IconType
}

const ButtonPhoneTo: React.FC<Props> = ({ tel, label, Icon }) => {
    return (
        <p className='flex items-center gap-2 text-secondary-dark text-lg'>
            <Icon />
            <Link
                to='#'
                onClick={(e) => {
                    window.location.href = tel;
                    e.preventDefault();
                }}
            >
                {label}
            </Link>
        </p>

    );
};

export default ButtonPhoneTo;
