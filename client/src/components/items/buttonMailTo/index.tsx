import React from "react";
import { Link } from "react-router-dom";
import type { IconType } from "react-icons";

type Props = {
    mailto: string;
    label: string;
    Icon: IconType
}

const ButtonMailto: React.FC<Props> = ({ mailto, label, Icon }) => {
    return (
        <p className='flex items-center gap-2 text-secondary-dark text-lg'>
            <Icon />
            <Link
                to='#'
                onClick={(e) => {
                    window.location.href = mailto;
                    e.preventDefault();
                }}
            >
                {label}
            </Link>
        </p>

    );
};

export default ButtonMailto;
