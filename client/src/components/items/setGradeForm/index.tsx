// import { useAppDispatch } from '@/redux/store';
// import { setGrade } from '@/redux/student/studentSlice';
// import type { Student } from '@/types';
// import React, { useState } from 'react'
// import { useForm } from 'react-hook-form';

// type Props = {
//     student: Student | null;
//     subjectId: string | undefined;
//     teacherId: string;
//     date: Date | undefined;
// }

// const SetGradeForm = ({ student, subjectId, teacherId, date }: Props) => {
//     // const [selectedStudentId, setSelectedStudentId] = useState<string | undefined>(undefined);
//     const dispatch = useAppDispatch();

//     const {
//         register,
//         watch,
//         resetField,
//         handleSubmit,
//         formState: { errors }
//     } = useForm();

//     const onSetMarkToStudent = async (data) => {
//         try {
//             const res = await dispatch(setGrade({
//                 value: data.mark,
//                 comment: data.comment,
//                 dateTime: date,
//                 studentId: student.id,
//                 subjectId,
//                 teacherId,
//             }));

//             resetField("mark");
//             resetField("comment");
//         } catch (error) {
//             console.log('error in setMrkToStudent', error);
//         }
//     }

//     return (
//         <>
//             <form className='' onSubmit={handleSubmit(onSetMarkToStudent)}>
//                 <input
//                     {...register('mark', { required: "mark is required" })}
//                     type="number"
//                     id='mark'
//                     className='bg-white outline'
//                 />
//                 {errors.mark && <span>{errors.mark.message}</span>}

//                 <input
//                     {...register(`comment`)}
//                     type="text"
//                     id="comment"
//                     className='bg-white outline'
//                 />

//                 <button type="submit">Set the value</button>
//             </form>
//         </>
//     )
// }

// export default SetGradeForm