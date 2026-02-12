import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { addStudentToTheClass, addSubjectToTheClass, addTeacherToSubject, editClass, getClassById, removeStudentFromTheClass, removeSubjectFromTheClass, removeTeacherFromTheSubject } from '@/redux/class/classSlice';
import type { RootState } from '@/redux/rootReducer';
import { useAppDispatch } from '@/redux/store';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { SUBJECTS } from '@/constants';
import { getAllStudents } from '@/redux/student/studentSlice';
import { useForm } from 'react-hook-form';
import { FiPlus, FiSave } from 'react-icons/fi';
import { MdOutlinePlayLesson, MdPeople } from 'react-icons/md';
import { FaRegTrashAlt } from 'react-icons/fa';
import { IoBookOutline } from 'react-icons/io5';
import Loader from '@/components/items/Loader';
import SubjectRow from '@/components/items/subjectRow';

interface ClassFormData {
    numberGrade: number;
    letter: string;
}

const ClassPage: React.FC = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();

    const { classItem, loading: classLoading, message: classMessage } = useSelector((state: RootState) => state.class);
    const { studentsList, loading: studentLoading } = useSelector((state: RootState) => state.student);
    const { teacherList, message: teacherMessage } = useSelector((state: RootState) => state.teacher);
    const { role } = useSelector((state: RootState) => state.user);

    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [selectedStudent, setSelectedStudent] = useState<string>('');
    const [selectedTeacher, setSelectedTeacher] = useState<string | undefined>('');

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<ClassFormData>();

    const classSubjectTitleSet = new Set(classItem?.subjects?.map(subjectEl => subjectEl.title) || []);

    const availableSubjects = SUBJECTS.filter(
        subjectItem => !classSubjectTitleSet.has(subjectItem)
    );

    useEffect(() => {
        if (classMessage) toast(classMessage);
    }, [classMessage]);

    useEffect(() => {
        if (teacherMessage) toast(teacherMessage);
    }, [teacherMessage]);

    useEffect(() => {
        if (id) {
            dispatch(getClassById({ id }));
            dispatch(getAllStudents());
        }
    }, []);

    const handleTeacherChange = (teacherId: string) => {
        setSelectedTeacher(teacherId);
    };

    const handleSubjectChange = (subject: string) => {
        setSelectedSubject(subject);
    };

    const handleStudentChange = (studentId: string) => {
        setSelectedStudent(studentId);
    };

    const handleAddStudent = async () => {
        if (!selectedStudent || !id) {
            toast.error('Please select a student');
            return;
        }

        try {
            await dispatch(addStudentToTheClass({ studentId: selectedStudent, classId: id })).unwrap();
            await dispatch(getAllStudents());
            setSelectedStudent('');
        } catch (error) {
            console.log('error in handleAddStudent', error);
            toast.error('Failed to add student');
        }
    }

    const handleRemoveStudent = async (studentId: string) => {
        if (!id) return;

        try {
            await dispatch(removeStudentFromTheClass({ studentId, classId: id })).unwrap();
            await dispatch(getAllStudents());
        } catch (error) {
            console.log('error in handleRemoveStudent', error);
            toast.error('Failed to remove student');
        }
    };

    const handleAddSubject = async () => {
        if (!selectedSubject || !id) {
            toast.error('Please select a subject');
            return;
        }

        try {
            await dispatch(addSubjectToTheClass({ title: selectedSubject, classId: id })).unwrap();
        } catch (error) {
            console.log('error in handleAddSubject', error);
            toast.error('Failed to add subject');
        }
    }

    const handleRemoveSubject = async (subjectId: string) => {
        try {
            await dispatch(removeSubjectFromTheClass({ subjectId })).unwrap();
        } catch (error) {
            console.log('error in handleRemoveSubject', error);
            toast.error('Failed to remove subject');
        }
    };

    const handleLinkTeacher = async (teacherItemId: string, subjectItemId: string) => {
        if (!id) return;

        try {
            await dispatch(addTeacherToSubject({ teacherId: teacherItemId, subjectId: subjectItemId }));
            setSelectedTeacher(undefined);
            await dispatch(getClassById({ id }));
        } catch (error) {
            console.log('error in handleLinkTeacher', error);
            toast.error('Failed to link teacher');
        }
    }

    const handleUnlinkTeacher = async ({ teacherId, subjectId }: { teacherId: string, subjectId: string }) => {
        if (!id) return;

        try {
            await dispatch(removeTeacherFromTheSubject({ teacherId, subjectId }));
            setSelectedTeacher(undefined);
            await dispatch(getClassById({ id }));
        } catch (error) {
            console.log('error in handleUnlinkTeacher', error);
            toast.error('Failed to unlink teacher');
        }
    }

    const handleChangeClass = async (formData: ClassFormData) => {
        if (!id || !classItem?.id) return;

        const changedNumber = Number(formData.numberGrade);
        const changedLetter = formData.letter;

        try {
            await dispatch(editClass({
                num: changedNumber,
                letter: changedLetter,
                classId: classItem?.id
            }));
            await dispatch(getClassById({ id }));
        } catch (error) {
            console.log('error in handleChangeClass', error);
            toast.error('Failed to update class');
        }
    }

    if (classLoading || studentLoading || !classItem) {
        return <Loader />
    };

    return (
        <div className='w-full p-5! flex flex-col gap-7'>
            <div className="flex flex-col gap-7">
                <div className="w-full bg-secondary-light shadow-xl text-black p-3! rounded-2xl">
                    <div className="flex items-center justify-start md:justify-start gap-3">
                        <MdOutlinePlayLesson className='w-15 h-15 bg-secondary-dark/75 rounded-2xl text-black p-3!' />
                        <h1 className='text-4xl capitalize'>Class {classItem.num}{classItem.letter}</h1>
                    </div>

                    <div className="flex items-center justify-start gap-2 text-primary-dark mt-5!">
                        <p className='text-sm'>{classItem.students?.length} students</p>
                        <span>&#x2022;</span>
                        <p className='text-sm'>{classItem.subjects?.length} subjects</p>
                    </div>
                </div>

                {role === 'teacher' || role === 'admin' && <div className="w-full bg-white shadow-xl text-black p-3! rounded-2xl">
                    <div className="">
                        <h1 className='font-medium text-xl flex items-center gap-2'><FiSave className='w-6 text-primary-light' /> Edit Class Information</h1>
                        <p className='text-sm mt-2!'>Update the class number and letter</p>
                    </div>

                    <form className='w-full flex flex-row items-end gap-3' onSubmit={handleSubmit(handleChangeClass)}>
                        <div className="">
                            <h1 className='font-medium mt-4!'>Number</h1>
                            <input
                                {...register('numberGrade', { required: "number is required" })}
                                type="number"
                                id='numberGrade'
                                className='bg-white outline w-full p-2! rounded-sm'
                                defaultValue={classItem.num || ""}
                            />
                            {/* @ts-ignore */}
                            {errors.mark && <span>{errors.mark.message}</span>}
                        </div>

                        <div className="">
                            <h1 className='font-medium mt-4!'>Letter</h1>
                            <input
                                {...register('letter', { required: "letter is required" })}
                                id="letter"
                                className='bg-white outline w-full p-2! rounded-lg'
                                placeholder='Your letter'
                                defaultValue={classItem.letter || ""}
                            />
                            {/* @ts-ignore */}
                            {errors.mark && <span>{errors.letter.message}</span>}
                        </div>

                        <button className='flex items-center justify-center text-center gap-3 cursor-pointer w-[180px] h-[41px] font-medium bg-primary-light text-primary-dark p-3! rounded-lg' type="submit">
                            <FiSave />
                            Change
                        </button>
                    </form>
                </div>}

                <div className="md:flex md:gap-3">
                    <div className="flex flex-col gap-3 w-full bg-white shadow-xl text-black p-3! rounded-2xl">
                        <h1 className='font-medium text-xl flex items-center gap-2'><IoBookOutline className='w-6 text-primary-light' /> Subjects ({classItem.subjects?.length})</h1>

                        <div className="mt-3!">
                            {role === 'admin' && <>
                                <Select onValueChange={handleSubjectChange}>
                                    <SelectTrigger className="w-full bg-secondary-light p-1! cursor-pointer">
                                        <SelectValue placeholder="Select a subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableSubjects.map((subEl, index) =>
                                            <SelectItem
                                                key={index}
                                                value={subEl}
                                                className='p-2! cursor-pointer'
                                            >
                                                {subEl}
                                            </SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <button className='mt-3! flex items-center justify-center text-center gap-3 cursor-pointer font-medium bg-primary-light text-primary-dark p-2! rounded-lg' onClick={handleAddSubject}><FiPlus /> Add Subject</button>
                            </>
                            }

                            <div className="flex flex-col grow mt-3!">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Subject</TableHead>
                                            <TableHead>Teacher</TableHead>
                                            <TableHead className='text-right'>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {classItem.subjects?.map(subject =>
                                            <SubjectRow
                                                key={subject.id}
                                                subjectItem={subject}
                                                classItem={classItem}
                                                role={role}
                                                teacherList={teacherList || []}
                                                selectedTeacher={selectedTeacher}
                                                onTeacherChange={handleTeacherChange}
                                                onLinkTeacher={handleLinkTeacher}
                                                // @ts-ignore
                                                onUnlinkTeacher={handleUnlinkTeacher}
                                                onRemoveSubject={handleRemoveSubject}
                                            />
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full bg-white shadow-xl text-black p-3! mt-5! md:mt-0! rounded-2xl">
                        <h1 className='font-medium text-xl flex items-center gap-2'><MdPeople className='w-6 text-primary-light' /> Students ({classItem.students?.length})</h1>

                        <div className="mt-3!">
                            {role === 'teacher' || role === 'admin' && (
                                <div className=''>
                                    <Select onValueChange={handleStudentChange}>
                                        <SelectTrigger className="w-full bg-secondary-light p-1! cursor-pointer">
                                            <SelectValue placeholder="Select a student" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {studentsList?.filter(studentListItem => studentListItem.classId === null)?.map(studentEl =>
                                                <SelectItem className='p-2! cursor-pointer' key={studentEl.id} value={studentEl.id}>
                                                    {studentEl.name}
                                                </SelectItem>)
                                            }
                                        </SelectContent>
                                    </Select>
                                    <button className='mt-3! flex items-center justify-center text-center gap-3 cursor-pointer font-medium bg-primary-light text-primary-dark p-2! rounded-lg' onClick={handleAddStudent}>
                                        <FiPlus />
                                        Add Student
                                    </button>
                                </div>
                            )}

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Surname</TableHead>
                                        {role === 'teacher' || role === 'admin' && <TableHead className='text-right'>Action</TableHead>}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {classItem.students?.map(studentItem =>
                                        <TableRow key={studentItem.id}>
                                            <TableCell className='py-5!'><Link to={`/profile/${studentItem.id}`}>{studentItem.name}</Link></TableCell>
                                            <TableCell className='py-5!'><Link to={`/profile/${studentItem.id}`}>{studentItem.surname}</Link></TableCell>
                                            <TableCell className='text-right py-5!'>
                                                <Button className='cursor-pointer' onClick={() => handleRemoveStudent(studentItem.id)} variant={'ghost'}>
                                                    <FaRegTrashAlt className='text-red-700' />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ClassPage