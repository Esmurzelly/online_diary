import React, { useEffect, useMemo, useState } from 'react';
import { getClassById } from '@/redux/class/classSlice';
import type { RootState } from '@/redux/rootReducer';
import { useAppDispatch } from '@/redux/store';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Calendar } from "@/components/ui/calendar"
import { getAllStudentsFromOneClass, removeGrade, setGrade, updateGrade } from '@/redux/student/studentSlice';
import Moment from 'react-moment';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
import { averageGrade } from '@/utils/averageGrade';
import { IoBookOutline, IoCalendarSharp } from 'react-icons/io5';
import { MdOutlineSchool } from 'react-icons/md';
import { FaSchool } from 'react-icons/fa';
import { FiSave } from 'react-icons/fi';
import type { Student, Teacher } from '@/types';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Loader from '@/components/items/Loader';

interface GradeFormData {
    mark: number;
    comment?: string;
}

const SubjectId: React.FC = () => {
    const { id } = useParams(); // id of subject from URL
    const dispatch = useAppDispatch();

    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    const classItem = useSelector((state: RootState) => state.class.classItem);
    const { studentsList, loading } = useSelector((state: RootState) => state.student);

    const [date, setDate] = useState<Date | undefined>(new Date());

    const currentSubject = useMemo(() => {
        if (!currentUser || !('subjects' in currentUser)) return null;
        const teacher = currentUser as Teacher;
        return teacher.subjects?.find(subject => subject.id === id)
    }, [currentUser, id]);

    const currentClassId = currentSubject?.classId;
    // const currentClassId = currentSubject[0].classId;

    const [changedValue, setChangedValue] = useState<number | string | undefined>();
    const [changedComment, setChangedComment] = useState<string>();
    const [selectedStudent, setSelectedStudent] = useState<Student | undefined>();

    const {
        register,
        resetField,
        handleSubmit,
        formState: { errors }
    } = useForm<GradeFormData>();

    const fetchData = async () => {
        if (!currentClassId) {
            console.error('No class ID available');
            return;
        };

        try {
            await dispatch(getClassById({ id: currentClassId })).unwrap();
            await dispatch(getAllStudentsFromOneClass({ classId: currentClassId })).unwrap();
        } catch (error) {
            console.error('Error fetching class data:', error);
            toast.error('Failed to load class data');
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentClassId, dispatch]);

    const onUpdateGrade = async (studentId: string, gradeId: string) => {
        if (!currentUser?.id || !id) return;

        try {
            if (changedValue || changedComment) {
                await dispatch(updateGrade({
                    comment: changedComment,
                    value: Number(changedValue),
                    teacherId: currentUser.id,
                    studentId,
                    subjectId: id,
                    gradeId
                })).unwrap();
            }
        } catch (error) {
            console.error('Error updating grade:', error);
            toast.error('Failed to update grade');
        }
    }

    const onDeleteGrade = async (studentId: string, gradeId: string) => {
        if (!currentUser?.id || !id || !currentClassId) return;

        try {
            await dispatch(removeGrade({
                teacherId: currentUser?.id,
                gradeId,
                studentId,
                subjectId: id
            })).unwrap();

            await dispatch(getClassById({ id: currentClassId })).unwrap();
        } catch (error) {
            console.error('Error deleting grade:', error);
            toast.error('Failed to delete grade');
        }
    };
    const onSetMarkToStudent = async (data: GradeFormData) => {
        if (!currentSubject || !currentUser?.id || !selectedStudent) {
            toast.error('Please select a student');
            return;
        }

        try {
            await dispatch(setGrade({
                value: data.mark,
                comment: data.comment || "",
                dateTime: date,
                studentId: selectedStudent.id,
                subjectId: currentSubject.id,
                teacherId: currentUser.id,
            }));

            resetField("mark");
            resetField("comment");
        } catch (error) {
            console.error('Error setting grade:', error);
            toast.error('Failed to add grade');
        }
    };

    if (loading || !currentUser) {
        return <Loader />
    }

    return (
        <div className='w-full p-5!'>
            <div className="flex flex-col gap-7">
                <div className="flex items-center justify-start bg-white rounded-2xl shadow-xl p-5! gap-5">
                    <IoBookOutline className='w-15 h-15 bg-secondary-dark/75 rounded-2xl text-black p-2!' />

                    <div className="flex flex-col items-start gap-1">
                        <p className='font-medium text-2xl'>{currentSubject?.title}</p>
                        <div className="flex items-center gap-5">
                            <p className='flex items-center gap-2'><MdOutlineSchool className='w-4' /> {classItem?.num}{classItem?.letter}</p>
                            <p className='flex items-center gap-2'><FaSchool className='w-4' /> {classItem?.school && classItem?.school.title}</p>
                        </div>
                    </div>
                </div>

                <div className="xl:flex xl:flex-row xl:items-start xl:gap-5">
                    <div className="xl:flex-1">
                        <div className="w-full flex flex-col items-start justify-start bg-white rounded-2xl shadow-xl p-5! gap-5">
                            <div className="">
                                <h1 className='font-medium text-xl flex items-center gap-2'><FiSave className='w-6 text-primary-light' /> Set Grade</h1>
                                <p className='text-sm mt-2!'>Add a grade for a student</p>
                            </div>

                            <div className="flex flex-col gap-2 w-full">
                                <h1 className='font-medium'>Student</h1>

                                <Select value={selectedStudent?.id} onValueChange={(value) => {
                                    const student = studentsList?.find(s => s.id === value);
                                    setSelectedStudent(student);
                                }}>
                                    <SelectTrigger className="cursor-pointer w-full bg-secondary-light p-2!">
                                        <SelectValue placeholder="Select a student" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Students</SelectLabel>
                                            {studentsList && studentsList.map(
                                                studentEl => <SelectItem
                                                    key={studentEl.id}
                                                    value={studentEl.id}
                                                    // onClick={() => setSelectedStudent(studentEl)}
                                                    className='cursor-pointer p-2!'
                                                >
                                                    {studentEl.name} {studentEl.surname}
                                                </SelectItem>
                                            )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                <div className="w-full">
                                    <h1 className='font-medium'>Grade</h1>

                                    <form className='w-full flex flex-col items-start gap-3' onSubmit={handleSubmit(onSetMarkToStudent)}>
                                        <input
                                            {...register('mark', { required: "mark is required" })}
                                            type="number"
                                            id='mark'
                                            className='bg-white outline w-full p-2! rounded-sm'
                                            placeholder='1-5'
                                        />
                                        {errors.mark && <span>{errors.mark.message}</span>}

                                        <h1 className='font-medium mt-4!'>Comment</h1>
                                        <textarea
                                            {...register(`comment`)}
                                            id="comment"
                                            className='bg-white outline w-full h-[100px] p-2! rounded-lg'
                                            placeholder='Your comment'
                                        />

                                        <button className='flex items-center justify-center text-center gap-3 cursor-pointer w-full font-medium bg-primary-light text-primary-dark p-3! rounded-lg' type="submit">
                                            <FiSave />
                                            Set the value
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-start justify-start bg-white rounded-2xl shadow-xl p-5! mt-7! gap-5">
                            <h1 className='font-medium text-xl flex items-center gap-2'>
                                <IoCalendarSharp className='w-6 text-primary-light' />
                                Calendar
                            </h1>

                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                // className="rounded-md border shadow-sm w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"
                                className="rounded-md border shadow-sm w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-full"
                                captionLayout="dropdown"
                            />
                        </div>
                    </div>


                    <div className="flex xl:flex-3 flex-col items-start justify-start bg-white rounded-2xl shadow-xl p-5! mt-5! xl:mt-0! gap-5">
                        <div className="">
                            <h1 className='font-medium text-xl flex items-center gap-2'><FiSave className='w-6 text-primary-light' /> Students ({classItem?.students?.length})</h1>
                            <p className='text-sm mt-2!'>Student grades and summaries</p>
                        </div>

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
                                    {studentsList && studentsList.length > 0 && studentsList?.map(studentItem => {
                                        if (!studentItem.grades || !id) return null;

                                        const sortedGrades = [...(studentItem.grades?.filter(gradeItem => gradeItem.subjectId === id) ?? [])]
                                            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                                        return <TableRow key={studentItem.id}>
                                            <TableCell className='py-5!'>{studentItem.name}</TableCell>
                                            <TableCell className='py-5!'>{studentItem.surname}</TableCell>
                                            <TableCell className='flex gap-2 py-5!'>{sortedGrades.map(gradeItem => (
                                                <Popover key={gradeItem.id}>
                                                    <PopoverTrigger asChild>
                                                        <Button className={`w-6 cursor-pointer ${gradeItem.value === 5 ? 'bg-red-600' : "bg-green-500"}`} variant="outline">{gradeItem.value}</Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-full p-3!">
                                                        <div className="grid gap-4">
                                                            <div className="space-y-2">
                                                                <h4 className="leading-none font-medium">Info</h4>
                                                                <p className="text-muted-foreground text-sm">
                                                                    <p className='font-bold break-all'>Comment: </p>
                                                                    {gradeItem.comment}
                                                                </p>

                                                                <p className="text-muted-foreground text-sm">
                                                                    <span className='font-bold'>Date: </span>
                                                                    <Moment format='DD/MM/YYYY' date={new Date(gradeItem.date)} />
                                                                </p>
                                                            </div>

                                                            <DialogTrigger asChild>
                                                                <Button className='w-[150px] cursor-pointer' variant="outline">Change</Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="sm:max-w-[425px] p-4!">
                                                                <DialogHeader>
                                                                    <DialogTitle>Edit profile</DialogTitle>
                                                                    <DialogDescription>
                                                                        Make changes to the grade / info here. Click save when you&apos;re
                                                                        done.
                                                                    </DialogDescription>
                                                                </DialogHeader>

                                                                <div className="grid gap-4">
                                                                    <div className="grid gap-3">
                                                                        <Label htmlFor="value">Grade</Label>
                                                                        <Input id="value" name="value" className='p-2!' onChange={(e: React.ChangeEvent<HTMLInputElement>) => setChangedValue(e.target.value)} defaultValue={gradeItem.value} />
                                                                    </div>
                                                                    <div className="grid gap-3">
                                                                        <Label htmlFor="comment">Comment</Label>
                                                                        <Input id="comment" name="comment" className='p-2!' onChange={(e: React.ChangeEvent<HTMLInputElement>) => setChangedComment(e.target.value)} defaultValue={gradeItem.comment} />
                                                                    </div>
                                                                </div>

                                                                <DialogFooter>
                                                                    <DialogClose asChild>
                                                                        <Button className='w-[150px] cursor-pointer' variant="outline">Cancel</Button>
                                                                    </DialogClose>
                                                                    <Button className='w-[150px] cursor-pointer' onClick={() => onUpdateGrade(studentItem.id, gradeItem.id)} type="submit">Save changes</Button>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                            <Button className='w-[150px] cursor-pointer' onClick={() => onDeleteGrade(studentItem.id, gradeItem.id)} variant={'destructive'}>Delete</Button>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            ))}</TableCell>

                                            <TableCell>{averageGrade(studentItem.grades, 2, id)}</TableCell>

                                            <TableCell>{averageGrade(studentItem.grades, 2, id)}</TableCell>
                                            <TableCell>{averageGrade(studentItem.grades, 2, id)}</TableCell>
                                            <TableCell>{averageGrade(studentItem.grades, 2, id)}</TableCell>
                                            <TableCell>{averageGrade(studentItem.grades, 2, id)}</TableCell>

                                            <TableCell className='text-right'>{averageGrade(studentItem.grades, 0, id)}</TableCell>

                                        </TableRow>
                                    }
                                    )}
                                </Dialog>

                            </TableBody>
                        </Table>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default SubjectId