import type { RootState } from '@/redux/rootReducer'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

type Props = {}

const Subjects = (props: Props) => {
    const { currentUser, loading, message, role } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (message) toast(message);
    }, [message]);

    if (loading) {
        return <h1>Loading...</h1>
    }

    if (!currentUser) {
        return <h1>No user!</h1>
    }

    return (
        <div>
            <h1>Subjects</h1>
            <ul className='flex flex-col gap-3'>
                {currentUser.subjects.map(subjectItem => <li key={subjectItem.id}>
                    <Link to={`/subject/${subjectItem.id}`}>
                        <p>title: {subjectItem.title}  </p>
                        <p>name of class: {subjectItem.class.num} {subjectItem.class.letter}</p>
                        <p>name of school: {subjectItem.teacher.school.title}</p>
                    </Link>
                </li>)}
            </ul>
        </div>
    )
}

export default Subjects