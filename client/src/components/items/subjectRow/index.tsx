import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableCell, TableRow } from '@/components/ui/table';
import type { ISubject, Role, Teacher } from '@/types';
import React from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';
import { RxCross2 } from 'react-icons/rx';
import { Link } from 'react-router-dom';

interface SubjectRowProps {
    subjectItem: ISubject;
    classItem: any;
    role: Role | null | undefined;
    teacherList: Teacher[];
    selectedTeacher: string | undefined;
    onTeacherChange: (teacherId: string) => void;
    onLinkTeacher: (teacherId: string, subjectId: string) => void;
    onUnlinkTeacher: (params: { teacherId: string | null; subjectId: string }) => void;
    onRemoveSubject: (subjectId: string) => void;
};

const SubjectRow: React.FC<SubjectRowProps> = ({
    subjectItem,
    classItem,
    role,
    teacherList,
    selectedTeacher,
    onTeacherChange,
    onLinkTeacher,
    onUnlinkTeacher,
    onRemoveSubject,
}) => {
    const hasTeacher = Boolean(subjectItem?.teacher);

    return (
        <TableRow key={subjectItem.id}>
            <TableCell className="max-w-[100px]">
                <p className="text-sm h-full text-wrap">{subjectItem.title}</p>
            </TableCell>

            <TableCell className="flex flex-col items-start gap-2 p-2!">
                {hasTeacher ? (
                    <Link
                        className="font-semibold hover:underline"
                        to={`/profile/${subjectItem.teacher?.id}`}
                    >
                        {subjectItem.teacher?.name} {subjectItem.teacher?.surname}
                    </Link>
                ) : (
                    <div className="flex items-center justify-center w-full text-gray-400">
                        <RxCross2 className="w-5 h-5" />
                    </div>
                )}

                {role === 'admin' && (
                    <div className="w-full flex flex-col gap-3">
                        <Select onValueChange={onTeacherChange}>
                            <SelectTrigger className="w-full bg-secondary-light p-1! cursor-pointer">
                                <SelectValue placeholder="Select a teacher" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Teachers</SelectLabel>
                                    {teacherList
                                        ?.filter(teacher => teacher.schoolId === classItem.schoolId)
                                        .map(teacher => (
                                            <SelectItem
                                                key={teacher.id}
                                                value={teacher.id}
                                                className="p-2! cursor-pointer"
                                            >
                                                {teacher.name} {teacher.surname}
                                            </SelectItem>
                                        ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        {hasTeacher ? (
                            <button
                                className='flex items-center justify-center text-center gap-3 cursor-pointer font-medium bg-primary-light/50 text-primary-dark p-2! rounded-lg'
                                onClick={() => onUnlinkTeacher({
                                    teacherId: subjectItem.teacherId,
                                    subjectId: subjectItem.id
                                })}
                            >
                                Unlink Teacher
                            </button>
                        ) : (
                            <button
                                className='flex items-center justify-center text-center gap-3 cursor-pointer font-medium bg-primary-light text-primary-dark p-2! rounded-lg'
                                disabled={!selectedTeacher}
                                onClick={() => selectedTeacher && onLinkTeacher(selectedTeacher, subjectItem.id)}
                            >
                                <FiPlus className="mr-2" />
                                Link Teacher
                            </button>
                        )}
                    </div>
                )}
            </TableCell>

            {role === 'admin' && (
                <TableCell className="text-right">
                    <Button
                        className="cursor-pointer"
                        onClick={() => onRemoveSubject(subjectItem.id)}
                        variant="ghost"
                        size="icon"
                    >
                        <FaRegTrashAlt className="text-red-700" />
                    </Button>
                </TableCell>
            )}
        </TableRow>
    );
}

export default SubjectRow