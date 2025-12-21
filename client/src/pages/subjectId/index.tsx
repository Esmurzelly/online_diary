import { getClassById } from '@/redux/class/classSlice';
import type { RootState } from '@/redux/rootReducer';
import { useAppDispatch } from '@/redux/store';
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Calendar } from "@/components/ui/calendar"
import { getAllStudentsFromOneClass, removeGrade, setGrade, updateGrade } from '@/redux/student/studentSlice';
import SetGradeForm from '@/components/items/setGradeForm';
import Moment from 'react-moment';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

type Props = {}

const SubjectId = (props: Props) => {
    const { id } = useParams();
    const { subjects: subjectsOfTeacher, id: currentUserId } = useSelector((state: RootState) => state.user.currentUser);
    const { num, letter, school } = useSelector((state: RootState) => state.class.classItem);
    const { student, studentsList } = useSelector((state: RootState) => state.student);
    const [date, setDate] = useState<Date | undefined>(new Date());

    const currentSubject = subjectsOfTeacher.filter(subjectItem => subjectItem.id === id);
    const currentClassId = currentSubject[0].classId;

    const [changedValue, setChangedValue] = useState<number | undefined>();
    const [changedComment, setChangedComment] = useState<string>();

    const dispatch = useAppDispatch();

    const getClassByIdFunction = async () => {
        await dispatch(getClassById({ id: currentClassId })).unwrap();
        await dispatch(getAllStudentsFromOneClass({ classId: currentClassId })).unwrap();
    }

    const averageGrade = (array: []) => {
        const initialValue = 0;

        const sumWithInitial = array.reduce(
            (accumulator, currentValue) => accumulator + currentValue.value,
            initialValue
        );

        return (sumWithInitial / array.length).toFixed(2)
    };

    const onUpdateGrade = async (studentId: string, gradeId: string) => {
        try {
            if (changedValue || changedComment) {
                const res = await dispatch(updateGrade({
                    comment: changedComment,
                    value: Number(changedValue),
                    teacherId: currentUserId,
                    studentId,
                    subjectId: id,
                    gradeId
                })).unwrap();
                console.log('res from onUpdateGrade - client', res);
            }
        } catch (error) {
            console.log('error in onUpdateGrade', error)
        }
    }

    const onDeleteGrade = async (studentId: string, gradeId: string) => {
        try {
            await dispatch(removeGrade({
                teacherId: currentUserId,
                gradeId,
                studentId,
                subjectId: id
            }));

            await dispatch(getClassById({ id: currentClassId })).unwrap();
        } catch (error) {
            console.log('error in onDeleteGrade', error)
        }
    }

    useEffect(() => {
        getClassByIdFunction();
    }, []);

    return (
        <div className='w-screen'>
            <h1>Subject Name - {currentSubject[0].title}</h1>

            <div className="">
                <h2>Info:</h2>
                <p>num: {num}</p>
                <p>letter: {letter}</p>
                <p>name of school: {school.title}</p>
            </div>

            <div className="w-full bg-green-400">
                <h2>Students</h2>
                <ul className='flex flex-col items-start gap-3 mt-5'>
                    {studentsList && studentsList.map(studentItem => <li key={studentItem.id} className='flex items-center'>
                        {studentItem.name} - {studentItem.surname}

                        <SetGradeForm student={studentItem} subjectId={id} date={date} teacherId={currentUserId} />
                    </li>)}
                </ul>
            </div>

            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border shadow-sm"
                captionLayout="dropdown"
            />


            <Table className='w-full'>
                <TableCaption>A list of students of course.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="name">Name</TableHead>
                        <TableHead className="surname">Surname</TableHead>
                        <TableHead className="value">Value</TableHead>
                        <TableHead className="avg">AVG</TableHead>
                        <TableHead className="one">1/4</TableHead>
                        <TableHead className="two">2/4</TableHead>
                        <TableHead className="three">3/4</TableHead>
                        <TableHead className="four">4/4</TableHead>
                        <TableHead className="summary text-right">Summary</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <Dialog>
                        {studentsList?.map(studentItem => {
                            const sortedGrades = useMemo(() => {
                                return [...(studentItem.grades ?? [])]
                                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                            }, [studentItem.grades]);

                            return (<TableRow key={studentItem.id}>
                                <TableCell>{studentItem.name}</TableCell>
                                <TableCell>{studentItem.surname}</TableCell>
                                <TableCell className='flex gap-2'>{sortedGrades.map(gradeItem => (
                                    <Popover key={gradeItem.id}>
                                        <PopoverTrigger asChild>
                                            <Button className={`w-6 cursor-pointer ${gradeItem.value === 5 ? 'bg-red-600' : "bg-green-500"}`} variant="outline">{gradeItem.value}</Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full">
                                            <div className="grid gap-4">
                                                <div className="space-y-2">
                                                    <h4 className="leading-none font-medium">Info</h4>
                                                    <p className="text-muted-foreground text-sm">
                                                        <span className='font-bold'>comment: </span>
                                                        {gradeItem.comment}
                                                    </p>

                                                    <p className="text-muted-foreground text-sm">
                                                        <span className='font-bold'>date: </span>
                                                        <Moment format='DD/MM/YYYY' date={new Date(gradeItem.date)} />
                                                    </p>
                                                </div>

                                                <DialogTrigger asChild>
                                                    <Button variant="outline">Change</Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px]">
                                                    <DialogHeader>
                                                        <DialogTitle>Edit profile</DialogTitle>
                                                        <DialogDescription>
                                                            Make changes to your profile here. Click save when you&apos;re
                                                            done.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid gap-4">
                                                        <div className="grid gap-3">
                                                            <Label htmlFor="value">Value</Label>
                                                            <Input id="value" name="value" onChange={e => setChangedValue(e.target.value)} defaultValue={gradeItem.value} />
                                                        </div>
                                                        <div className="grid gap-3">
                                                            <Label htmlFor="comment">Comment</Label>
                                                            <Input id="comment" name="comment" onChange={e => setChangedComment(e.target.value)} defaultValue={gradeItem.comment} />
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <Button variant="outline">Cancel</Button>
                                                        </DialogClose>
                                                        <Button onClick={() => onUpdateGrade(studentItem.id, gradeItem.id)} type="submit">Save changes</Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                                <Button onClick={() => onDeleteGrade(studentItem.id, gradeItem.id)} variant={'destructive'}>Delete</Button>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                ))}</TableCell>

                                <TableCell>{averageGrade(studentItem.grades)}</TableCell>

                                <TableCell>{averageGrade(studentItem.grades)}</TableCell>
                                <TableCell>{averageGrade(studentItem.grades)}</TableCell>
                                <TableCell>{averageGrade(studentItem.grades)}</TableCell>
                                <TableCell>{averageGrade(studentItem.grades)}</TableCell>

                                <TableCell className='text-right'>{averageGrade(studentItem.grades)}</TableCell>

                            </TableRow>)
                        }

                        )}
                    </Dialog>

                </TableBody>
            </Table>
        </div>
    )
}

export default SubjectId