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
import { toast } from 'react-toastify';
import { averageGrade } from '@/utils/averageGrade';
import Loader from '@/components/items/Loader';
import type { IGrade, ISubject } from '@/types';
import GradePopover from '@/components/items/gradePopover';

const MarksPage: React.FC = () => {
    const { currentUser, loading, message, role } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (message) toast(message)
    }, []);

    if (role !== 'student') {
        return <div>No access</div>
    }

    if (loading) {
        return <Loader />
    }

    return (
        <div className='w-full'>
            <h1>Your marks</h1>

            <Table className=''>
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
                    {currentUser && currentUser.class && currentUser.class.subjects && currentUser.class.subjects.map((subjectItem: ISubject) => {
                        const grades: IGrade[] = 'grades' in currentUser ? (currentUser.grades ?? []) : [];

                        return (
                            <TableRow key={subjectItem.id}>
                                <TableCell className='h-10'>{subjectItem.title}</TableCell>

                                <TableCell className='flex gap-2'>
                                    {grades.filter((gradeItem: IGrade) => gradeItem.subjectId === subjectItem.id).map((gradeItemTwo: IGrade) =>
                                        <GradePopover grade={gradeItemTwo} />
                                    )}
                                </TableCell>

                                <TableCell>{averageGrade(grades, 2, subjectItem.id)}</TableCell>
                                <TableCell>{averageGrade(grades, 2, subjectItem.id)}</TableCell>
                                <TableCell>{averageGrade(grades, 2, subjectItem.id)}</TableCell>
                                <TableCell>{averageGrade(grades, 2, subjectItem.id)}</TableCell>
                                <TableCell>{averageGrade(grades, 2, subjectItem.id)}</TableCell>
                                <TableCell className='text-right'>{averageGrade(grades, 0, subjectItem.id)}</TableCell>
                            </TableRow>
                        )
                    }
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default MarksPage