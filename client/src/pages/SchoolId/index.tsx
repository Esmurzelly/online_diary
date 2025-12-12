import { Button } from '@/components/ui/button';
import type { RootState } from '@/redux/rootReducer';
import { addClassToSchool, deleteClass, getSchoolById } from '@/redux/school/schoolSlice';
import { useAppDispatch } from '@/redux/store';
import type { ISchool } from '@/types';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'

type Props = {}

const SchoolId = (props: Props) => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    // const [school, setSchool] = useState<ISchool>();
    const [showClasses, setShowClasses] = useState(false);
    const { loading, message, currentSchool } = useSelector((state: RootState) => state.school);
    const {
        register,
        watch,
        handleSubmit,
        formState: { errors }
    } = useForm<{ num: number, letter: string }>();

    useEffect(() => {
        dispatch(getSchoolById({ id }));
    }, []);

    const handleAddClassToSchool = async (data: { num: number, letter: string }) => {
        try {
            const res = await dispatch(addClassToSchool({
                letter: data.letter,
                num: Number(data.num),
                schoolId: currentSchool?.id
            }));

            dispatch(getSchoolById({ id }));
        } catch (error) {
            console.log(`error in onSubmit - ${error}`);
        }
    }

    const handleDeleteClass = async ({ id }: { id: string }) => {
        try {
            await dispatch(deleteClass({ id }));
            dispatch(getSchoolById({ id: currentSchool?.id }));
        } catch (error) {
            console.log(`error in onSubmit - ${error}`);
        }
    }

    console.log('currentSchool', currentSchool);

    if (loading) {
        <h1>Loading...</h1>
    }

    return (
        <div>
            <h1>School id {id}</h1>

            <div className="flex flex-col">
                <p>title: {currentSchool?.title}</p>
                <p>email: {currentSchool?.email}</p>
                <p>address: {currentSchool?.address}</p>
                <p>phone: {currentSchool?.phone}</p>
                <p>amount of classes: {currentSchool?.classes.length}</p>

                <Button onClick={() => setShowClasses(state => !state)} className='w-[200px]'>{showClasses ? "Hide" : "Show"} classes</Button>
            </div>

            <form onSubmit={handleSubmit(handleAddClassToSchool)}>
                <div className="flex flex-col items-end bg-gray-400 p-4">
                    <div className="">
                        <label htmlFor="num">Num:</label>
                        <input
                            {...register("num", { required: "num is required" })}
                            type="text"
                            id="num"
                            className='bg-white outline'
                        />
                        {errors.num && <span>{errors.num.message}</span>}
                    </div>

                    <div className="">
                        <label htmlFor="letter">Letter:</label>
                        <input
                            {...register("letter", { required: "letter is required" })}
                            type="text"
                            id="letter"
                            className='bg-white outline'
                        />
                        {errors.letter && <span>{errors.letter.message}</span>}
                    </div>
                </div>

                <input type="submit" value="Create" />
            </form>

            {showClasses && <ul className='flex flex-col gap-3'>
                {currentSchool?.classes.map(classEl => <li key={classEl.id} className='bg-green-400 flex flex-row items-center justify-between'>
                    <p className='text-2xl'>{classEl.num} {classEl.letter}</p>
                    <Button onClick={() => handleDeleteClass({ id: classEl.id })} className='w-[100px]' variant={'destructive'}>delete</Button>
                </li>)}
            </ul>}
        </div>
    )
}

export default SchoolId