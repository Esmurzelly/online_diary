import React, { useEffect } from 'react'
import type { RootState } from '@/redux/rootReducer'
import { useSelector } from 'react-redux'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Moment from 'react-moment';
import { toast } from 'react-toastify';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { averageGrade } from '@/utils/averageGrade';

type Props = {}

const MarksPage = (props: Props) => {
    const { currentUser, loading, message, role } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (message) toast(message)
    }, [message]);

    if (role !== 'student') {
        return <div>No access</div>
    }

    if (loading) {
        return <div>Loading...</div>
    }

        return (
        <div className='w-screen'>
            <h1>Your marks</h1>

            <Table className='w-full'>
                <TableCaption>Marks of course</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-1/3">Subject</TableHead>
                        <TableHead>Mark</TableHead>
                        <TableHead>AVG</TableHead>
                        <TableHead className="one">1/4</TableHead>
                        <TableHead className="two">2/4</TableHead>
                        <TableHead className="three">3/4</TableHead>
                        <TableHead className="four">4/4</TableHead>
                        <TableHead className="summary text-right">Summary</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {currentUser && currentUser.class && currentUser.class.subjects.map(subjectItem => (
                        <TableRow key={subjectItem.id}>
                            <TableCell className='h-10'>{subjectItem.title}</TableCell>

                            <TableCell className='flex gap-2'>
                                {currentUser.grades.filter(gradeItem => gradeItem.subjectId === subjectItem.id).map(gradeItemTwo =>
                                    <Popover key={gradeItemTwo.id}>
                                        <PopoverTrigger asChild>
                                            <Button className={`w-7 cursor-pointer ${gradeItemTwo.value === 5 ? 'bg-red-600' : "bg-green-500"}`} variant="outline">{gradeItemTwo.value}</Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full">
                                            <div className="grid gap-4">
                                                <div className="space-y-2">
                                                    <h4 className="leading-none font-medium">Info</h4>
                                                    <p className="text-muted-foreground text-sm">
                                                        <span className='font-bold'>comment: </span>
                                                        {gradeItemTwo.comment}
                                                    </p>

                                                    <p className="text-muted-foreground text-sm">
                                                        <span className='font-bold'>date: </span>
                                                        <Moment format='DD/MM/YYYY' date={new Date(gradeItemTwo.date)} />
                                                    </p>

                                                    {/* <p className="text-muted-foreground text-sm">
                                                        <span className='font-bold'>teacher: </span>
                                                        
                                                    </p> */}
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                )}
                            </TableCell>

                            <TableCell>{averageGrade(currentUser.grades, 2, subjectItem.id)}</TableCell>
                            <TableCell>{averageGrade(currentUser.grades, 2, subjectItem.id)}</TableCell>
                            <TableCell>{averageGrade(currentUser.grades, 2, subjectItem.id)}</TableCell>
                            <TableCell>{averageGrade(currentUser.grades, 2, subjectItem.id)}</TableCell>
                            <TableCell>{averageGrade(currentUser.grades, 2, subjectItem.id)}</TableCell>
                            <TableCell className='text-right'>{averageGrade(currentUser.grades, 0, subjectItem.id)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default MarksPage