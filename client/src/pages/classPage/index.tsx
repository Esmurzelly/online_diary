import { Button } from '@/components/ui/button';
import { addStudentToTheClass, addSubjectToTheClass, getClassById, removeStudentFromTheClass, removeSubjectFromTheClass } from '@/redux/class/classSlice';
import type { RootState } from '@/redux/rootReducer';
import { useAppDispatch } from '@/redux/store';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { SUBJECTS } from '@/constants';
import { getAllStudents } from '@/redux/student/studentSlice';

type Props = {}

const ClassPage = (props: Props) => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const { classItem, loading: classLoading, message } = useSelector((state: RootState) => state.class);
    const { studentsList, loading: studentLoading } = useSelector((state: RootState) => state.student);
    const [selectedSubject, setSelectedSubject] = useState<string>();
    const [selectedStudent, setSelectedStudent] = useState<string>();

    const classSubjectTitleSet = new Set(classItem?.subjects?.map(subjectEl => subjectEl.title));
    const availableSubjects = SUBJECTS.filter(
        subjectItem => !classSubjectTitleSet.has(subjectItem)
    );

    useEffect(() => {
        if (message) toast(message)
    }, [message]);

    useEffect(() => {
        dispatch(getClassById({ id }));
        dispatch(getAllStudents());
        // dispatch(studentsFromOneClass({ classId: classItem?.id }));
    }, []);

    const handleSubjectChange = (state: string) => {
        setSelectedSubject(state);
        console.log(selectedSubject)
    };

    const handleStudentChange = (state: string) => {
        setSelectedStudent(state);
    };

    const handleAddStudent = async () => {
        try {
            if (selectedStudent) {
                await dispatch(addStudentToTheClass({ studentId: selectedStudent, classId: id })).unwrap();
                await dispatch(getAllStudents());
            }
        } catch (error) {
            console.log('error in handleAddStudent', error)
        }
    }

    const handleRemoveStudent = async (studentId: string) => {
        try {
            await dispatch(removeStudentFromTheClass({ studentId, classId: id })).unwrap();
            await dispatch(getAllStudents());
        } catch (error) {
            console.log('error in handleAddStudent', error);
        }
    };

    const handleAddSubject = async () => {
        try {
            await dispatch(addSubjectToTheClass({ title: selectedSubject, classId: id })).unwrap();
        } catch (error) {
            console.log('error in handleAddStudent', error);
        }
    }

    const handleRemoveSubject = async (subjectId: string) => {
        try {
            const res = await dispatch(removeSubjectFromTheClass({ subjectId })).unwrap();
            console.log('res from handleRemoveSubject', res);
        } catch (error) {
            console.log('error in handleAddStudent', error);
        }
    }


    if (classLoading || studentLoading || !classItem) {
        return <h1>Loading...</h1>
    };

    return (
        <div className='w-screen'>
            <p>classPage id {classItem.id}</p>
            <p>letter {classItem.letter}</p>
            <p>num {classItem.num}</p>

            <div className="flex flex-row border w-full justify-between">
                <div className="bg-blue-300 flex flex-col grow">
                    <h1>subjects</h1>
                    <ul className='h-full flex flex-col gap-3'>
                        {classItem.subjects?.map(subjectItem =>
                            <li className='flex justify-between items-center' key={`${classItem.id}_${uuidv4()}`}>
                                <span>{subjectItem.title}</span>
                                <Button onClick={() => handleRemoveSubject(subjectItem.id)} variant={'destructive'}>delete subject</Button>
                            </li>
                        )}
                    </ul>

                    <Select onValueChange={handleSubjectChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableSubjects.map((subEl, index) => <SelectItem key={index} value={subEl}>{subEl}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Button onClick={handleAddSubject}>Add Subject</Button>
                </div>

                <div className="bg-green-500 flex flex-col grow">
                    <h1>students</h1>
                    <ul className='h-full flex flex-col gap-3'>
                        {classItem.students?.map(studentItem =>
                            <li key={studentItem.id}>
                                <span>{studentItem.name}</span>
                                <Button onClick={() => handleRemoveStudent(studentItem.id)} variant={'destructive'}>delete student</Button>
                            </li>
                        )}
                    </ul>

                    <Select onValueChange={handleStudentChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a student" />
                        </SelectTrigger>
                        <SelectContent>
                            {studentsList?.filter(studentListItem => studentListItem.classId === null)?.map(studentEl => <SelectItem key={studentEl.id} value={studentEl.id}>{studentEl.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Button onClick={handleAddStudent}>Add Student</Button>
                </div>
            </div>


        </div>
    )
}

export default ClassPage