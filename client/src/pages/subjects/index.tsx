import type { RootState } from '@/redux/rootReducer'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { IoIosBookmarks } from "react-icons/io";
import { SiGoogleclassroom } from "react-icons/si";
import { FaSchool } from "react-icons/fa";
import { GoLinkExternal } from "react-icons/go";

type Props = {}

const Subjects = (props: Props) => {
    const { currentUser, loading, message, role } = useSelector((state: RootState) => state.user);

    const numberOfClasses = currentUser?.subjects ? currentUser?.subjects.map(tempEl => tempEl.classId) : [];

    useEffect(() => {
        if (message) toast(message);
    }, [message]);

    if (loading) {
        return <h1>Loading...</h1>
    }

    if (!currentUser) {
        return <h1>No user!</h1>
    }

    if(!currentUser.subjects) {
        return "No access"
    }

    return (
        <div className='w-full p-5!'>
            <div className="bg-white rounded-2xl p-3! shadow-xl">
                <h1 className='flex items-center gap-2 font-semibold text-primary-dark'><IoIosBookmarks className='text-primary-light w-5 h-5' /> All Subjects ({currentUser.subjects.length})</h1>
                <Table className='mt-5!'>
                    <TableCaption>A list of your own subjects.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='text-primary-dark'>Subject</TableHead>
                            <TableHead className='text-primary-dark'>Class</TableHead>
                            <TableHead className='text-primary-dark'>School</TableHead>
                            <TableHead className='text-primary-dark text-right'>Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {currentUser.subjects.map(subjectItem => <TableRow className='' key={subjectItem.id}>
                            <TableCell className='py-5!'>
                                <div className="flex items-center gap-2 text-primary-dark">
                                    <IoIosBookmarks className='text-primary-light w-3 h-3' />
                                    {subjectItem.title}
                                </div>
                            </TableCell>

                            <TableCell className='py-5!'>
                                <div className="flex items-center gap-2 text-primary-dark">
                                    <SiGoogleclassroom className='text-primary-light w-3 h-3' />
                                    {subjectItem.class.num}{subjectItem.class.letter}
                                </div>
                            </TableCell>

                            <TableCell className='py-5!'>
                                <div className="flex items-center gap-2 text-primary-dark">
                                    <FaSchool className='text-primary-light w-3 h-3' />
                                    {subjectItem.teacher.school.title}
                                </div>
                            </TableCell>

                            <TableCell className='py-5! text-right w-[50px]'>
                                <div className="flex items-center justify-center font-medium gap-3 text-primary-dark bg-secondary-light px-2! py-2! rounded-lg">
                                    <GoLinkExternal className='text-primary-light w-3 h-3' />
                                    <Link to={`/subject/${subjectItem.id}`}>Open</Link>
                                </div>
                            </TableCell>
                        </TableRow>)}
                    </TableBody>
                </Table>
            </div>

            <div className="mt-10! flex flex-col md:flex-row items-center justify-between gap-5 w-full">
                <div className="bg-white rounded-2xl p-3! shadow-xl flex items-center gap-5 w-full">
                    <IoIosBookmarks className='text-primary-light w-10 h-10' />
                    
                    <div className="">
                        <p className='font-semibold text-2xl'>{currentUser.subjects.length}</p>
                        <p className='text-sm mt-1!'>Total Subjects</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-3! shadow-xl flex items-center gap-5 w-full">
                    <SiGoogleclassroom className='text-primary-light w-10 h-10' />
                    
                    <div className="">
                        <p className='font-semibold text-2xl'>{new Set(numberOfClasses).size}</p>
                        <p className='text-sm mt-1!'>Classes</p>

                    </div>
                </div>
            </div>


        </div>
    )
}

export default Subjects