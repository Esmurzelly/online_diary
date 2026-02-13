import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { Parent, Student } from '@/types';
import React from 'react'
import { Link } from 'react-router-dom';

interface UserCardProps {
    user: Student | Parent;
    onRemove: (userId: string) => void;
    linkText: string;
}


const UserCardProfile: React.FC<UserCardProps> = ({ user, linkText, onRemove }) => {
    return (
        <div className="flex text-sm items-center gap-3 justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <Avatar className="w-12 h-12">
                <AvatarImage src={user?.avatarUrl ? `http://localhost:3000${user.avatarUrl}` : undefined} />
                <AvatarFallback className="bg-primary-light text-white">
                    {user.name?.[0]}{user.surname?.[0]}
                </AvatarFallback>
            </Avatar>

            <div className="flex flex-col items-start flex-1">
                <h1 className="font-medium">{user.name} {user.surname}</h1>
                <p className="text-gray-600 text-xs">{user.email}</p>
            </div>

            <div className="flex items-center gap-2">
                <Link
                    className="text-xs bg-secondary-light hover:bg-secondary-dark hover:text-white transition-colors px-3 py-2 rounded-lg"
                    to={`/profile/${user.id}`}
                >
                    {linkText}
                </Link>
                <Button
                    className="cursor-pointer"
                    onClick={() => onRemove(user.id)}
                    size="sm"
                    variant="destructive"
                >
                    Remove
                </Button>
            </div>
        </div>
    )
}

export default UserCardProfile