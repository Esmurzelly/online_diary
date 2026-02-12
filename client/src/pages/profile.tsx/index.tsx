import React, { useEffect, useRef, useState } from 'react';
import type { RootState } from '@/redux/rootReducer';
import { useSelector } from 'react-redux';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useAppDispatch } from '@/redux/store';
import { updateUser, removeUser, getAllUsers, removeUserByAdmin, addParentToChild, removeParentToChild, getMe } from '@/redux/user/userSlice';
import { toast } from 'react-toastify';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link, useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllSchools } from '@/redux/school/schoolSlice';
import { FaPen } from "react-icons/fa6";
import { MdOutlineEmail, MdOutlineLocalPhone, MdOutlineSchool } from "react-icons/md";
import { FiExternalLink } from "react-icons/fi";
import { RiParentFill } from "react-icons/ri";
import { FaAddressBook } from "react-icons/fa";

type Props = {}

type FormValues = {
    email: string;
    name: string;
    password: string;
    surname: string;
    phone: string | undefined | null;
    address: string | undefined | null;
    avatarUrl: string;
}

const Profile = (props: Props) => {
    const { currentUser, role, message, users } = useSelector((state: RootState) => state.user);
    const { schoolList } = useSelector((state: RootState) => state.school);
    const [showChildren, setShowChildren] = useState(false);
    const [childId, setChildId] = useState<string | undefined>();

    const {
        handleSubmit,
        register,
        watch,
        formState: { errors }
    } = useForm<FormValues>({
        defaultValues: {
            name: currentUser?.name,
            surname: currentUser?.surname,
            password: "",
            email: currentUser?.email,
            phone: currentUser?.phone,
            address: currentUser?.address
        }
    });
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [showUsers, setShowUsers] = useState<boolean>(false);

    const filePicekerRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleAvatarClick = () => {
        console.log(filePicekerRef.current)
        filePicekerRef.current?.click();
    };


    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader();
        const selectedFile = e.target.files?.[0];

        if (selectedFile) {
            reader.readAsDataURL(selectedFile);
            setSelectedFile(selectedFile);

            const formData = new FormData();
            formData.append("avatar", selectedFile);

            dispatch(updateUser({ formData, id: currentUser?.id, role })).unwrap();
        }

        // reader.onload = (readerEvent) => {
        //     if (selectedFile.type.includes("image")) {
        //         console.log("readerEvent.target.result", readerEvent.target.result);
        //     }
        // };

        // console.log('selectedFile', selectedFile) // ok!
        // console.log('filePicekerRef', filePicekerRef); // ok!
    }

    const handleDeleteUser = async () => {
        try {
            const res = await dispatch(removeUser({ id: currentUser?.id, role }));
            console.log('res from client - remvoeUser', res);

            if (res.payload?.message === "Request failed with status code 404") {
                console.log("ERRRORORROOR")
                return;
            }

            navigate('/auth');
        } catch (error) {
            console.log(`error in handleDeleteUser - ${error}`);
        }
    }

    const handleSubmitForm: SubmitHandler<FormValues> = async () => {
        console.log('tututuu')
        try {
            const formData = new FormData();
            formData.append("name", watch('name'));
            formData.append("surname", watch('surname'));
            formData.append("email", watch('email'));
            formData.append("phone", watch('phone'));
            formData.append("address", watch('address'));

            if (watch('password') && watch('password').length > 0) {
                formData.append("password", watch('password'));
            }

            // console.log("FORMDATA from client ->", [...formData.entries()]); // ok!
            // console.log('selectedFile', selectedFile); // ok!

            const res = await dispatch(updateUser({ formData, id: currentUser?.id, role }));
            console.log('res from form in client', res);
        } catch (error) {
            console.log(`error in handleSubmit - ${error}`);
        }
    };

    const handleFetchUsers = async () => {
        try {
            const res = await dispatch(getAllUsers());
            setShowUsers(state => !state);
        } catch (error) {
            console.log(`error in handleFetchUsers - ${error}`);
        }
    }

    const handleDeleteUserByAdmin = async ({ id }: { id: string | undefined }) => {
        try {
            await dispatch(removeUserByAdmin({ id }));
            dispatch(getAllUsers());
        } catch (error) {
            console.log(`error in handleDeleteUserByAdmin - ${error}`);
        }
    }

    const onAddParentToChild = async (studentId: string) => {
        try {
            await dispatch(addParentToChild({
                parentId: currentUser?.id,
                studentId,
            }));
        } catch (error) {
            console.log(`error in onAddParentToChild - ${error}`);
        }
    }

    const onRemoveParentToChild = async (studentId: string) => {
        try {
            const res = await dispatch(removeParentToChild({
                parentId: currentUser?.id,
                studentId,
            }));

            console.log('res in onAddParentToChild', res);
        } catch (error) {
            console.log(`error in onAddParentToChild - ${error}`);
        }
    };

    const handleUserIdChange = (studentId: string | undefined) => {
        setChildId(studentId)
    }

    useEffect(() => {
        if (message) {
            toast(message)
        }
    }, [message]);

    useEffect(() => {
        dispatch(getAllSchools()).unwrap();
    }, []);

    if (!currentUser) {
        return <h1>Loading...</h1>
    }

    return (
        <div className='w-full h-screen flex flex-col items-center gap-3 font-inter px-8! py-3!'>
            <div className="flex flex-row items-center justify-between">
                <div className="w-1/2">
                    <h1 className='text-3xl'>My Profile</h1>
                    <p className='text-sm'>Manage your personal information</p>
                </div>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button className='w-[150px] cursor-pointer' variant="outline">
                            <FaPen />
                            Edit profile
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-80 p-3!'>
                        <form onSubmit={handleSubmit(handleSubmitForm)}>
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <h4 className="leading-none font-medium">Your data</h4>
                                    <p className="text-muted-foreground text-sm">
                                        Change your data here
                                    </p>
                                </div>
                                <div className="grid gap-2">
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            type='text'
                                            defaultValue={currentUser?.name}
                                            className="col-span-2 h-8"
                                            {...register("name")}
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type='text'
                                            defaultValue={''}
                                            className="col-span-2 h-8"
                                            {...register("password")}
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="surname">Surname</Label>
                                        <Input
                                            id="surname"
                                            type='text'
                                            defaultValue={currentUser?.surname}
                                            className="col-span-2 h-8"
                                            {...register("surname")}
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type='email'
                                            defaultValue={currentUser?.email}
                                            className="col-span-2 h-8"
                                            {...register("email")}
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="adress">Adress</Label>
                                        <Input
                                            id="adress"
                                            defaultValue={currentUser?.address}
                                            className="col-span-2 h-8"
                                            {...register("address")}
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            defaultValue={currentUser?.phone}
                                            className="col-span-2 h-8"
                                            {...register("phone")}
                                        />
                                    </div>
                                    {/* <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="avatar">Avatar</Label>
                                        <Button type='button' className='cursor-pointer' onClick={handleAvatarClick}>Change avatar</Button>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            ref={filePicekerRef}
                                            onChange={handleAvatarChange}
                                        />
                                    </div> */}

                                </div>
                            </div>
                            {/* <Button onClick={() => console.log('change temp button')} className='cursor-pointer z-50' type='button' disabled={role === undefined || role === 'none' || role === null || !role}>Change temp</Button> */}
                            <Button className='cursor-pointer' type='submit' disabled={role === undefined || role === 'none' || role === null || !role}>Change Data</Button>
                        </form>
                    </PopoverContent>
                </Popover>
            </div>

            <div className="flex flex-col min-w-full text-xl items-center justify-between gap-2 bg-white rounded-2xl shadow-xl p-5!">
                {
                    currentUser?.avatarUrl
                        ? <Avatar onClick={handleAvatarClick} className='size-28'>
                            <AvatarImage src={`http://localhost:3000${currentUser?.avatarUrl}`} />
                            <AvatarFallback>avatarUrl</AvatarFallback>
                        </Avatar>
                        : <div onClick={handleAvatarClick} className="flex items-center justify-center uppercase text-white text-3xl bg-secondary-dark w-28 h-28 rounded-full">
                            {currentUser.name ? currentUser.name.split('')[0] : "A"}
                            {currentUser.name ? currentUser.surname.split('')[0] : "A"}
                        </div>
                }
                <input
                    type="file"
                    accept="image/*"
                    hidden
                    ref={filePicekerRef}
                    onChange={handleAvatarChange}
                />
                <p>{currentUser?.name} {currentUser?.surname}</p>

                <p className='bg-secondary-dark text-secondary-light px-4! py-1! rounded-3xl text-sm capitalize'>{role}</p>
                <p className='flex items-center gap-2 text-secondary-dark text-lg'><MdOutlineEmail /> {currentUser?.email}</p>
                <p className='flex items-center gap-2 text-secondary-dark text-lg'><MdOutlineLocalPhone /> {currentUser?.phone || "no phone"}</p>
                <p className='flex items-center gap-2 text-secondary-dark text-lg'><FaAddressBook /> {currentUser?.address || "no address"}</p>

                {role === 'teacher' && <Link className='flex items-center text-sm rounded-xl gap-1 bg-primary-light px-4! py-1!' to={`/subjects`}>Subjects</Link>}
            </div>


            {role === 'parent' &&
                <div className="flex flex-col min-w-full text-xl items-center justify-between gap-2 bg-white rounded-2xl shadow-xl p-5!">
                    <div className="text-xl w-full">
                        <h1 className='flex items-center gap-2 mb-1!'><RiParentFill className='text-primary-light' /> Children</h1>
                        <p className='text-sm'>Connected children accounts</p>

                        <div className="">
                            <div className='flex flex-col items-start items-center gap-2'>
                                <Button className='px-2! cursor-pointer' onClick={() => setShowChildren(state => !state)}>{showChildren ? "Hide" : "Show"} children</Button>

                                {showChildren &&
                                    <div className='flex items-center gap-2'>
                                        <Select value={childId} onValueChange={handleUserIdChange}>
                                            <SelectTrigger className="w-[180px] cursor-pointer">
                                                <SelectValue placeholder="Select the parent" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Parents</SelectLabel>

                                                    {/* mutable array? */}
                                                    {users?.filter(userEl => userEl.parentIds).map(userEl =>
                                                        <SelectItem key={userEl.id} className='w-full py-2! px-1!' value={userEl.id}>
                                                            {userEl.name}
                                                        </SelectItem>)}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>

                                        <Button className='px-2! cursor-pointer' onClick={() => onAddParentToChild(childId)} variant={'outline'}>Add Child</Button>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col items-start w-full gap-3'>
                        {currentUser && currentUser?.children && currentUser?.children.length > 0 ? (
                            currentUser?.children.map(childrenEl => (
                                <div key={childrenEl.id} className="flex text-sm items-center gap-2 justify-between w-full">
                                    <Avatar className=''>
                                        <AvatarImage src={`http://localhost:3000${childrenEl?.avatarUrl}`} />
                                        <AvatarFallback>avatarUrl</AvatarFallback>
                                    </Avatar>

                                    <div className="flex flex-col items-start">
                                        <h1>{childrenEl.name} {childrenEl.surname}</h1>
                                        <p>{childrenEl.email}</p>
                                    </div>

                                    <div className="">
                                        <Link className='flexbg-secondary-light px-4! py-2! rounded-2xl text-black' to={`/profile/${childrenEl.id}`}>View Profile</Link>
                                        <Button className='w-10 cursor-pointer' onClick={() => onRemoveParentToChild(childrenEl.id)} size={'sm'} variant={'destructive'}>
                                            -
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : "no parents"}
                    </div>
                </div>
            }

            {role === 'teacher' && <div className="flex flex-col min-w-full text-xl items-center justify-between gap-4 bg-white rounded-2xl shadow-xl p-5!">
                <div className="text-xl w-full">
                    <h1 className='flex items-center gap-2 mb-1!'><MdOutlineSchool className='text-primary-light' /> Teacher's Information</h1>
                    <p className='text-sm'>Your current classes info</p>
                </div>

                {currentUser && currentUser?.schoolId ? (
                    <div className="text-lg flex items-center justify-between w-full">
                        <div className="">
                            <p>School's title: <span className='font-medium'>{currentUser.school?.title}</span></p>
                        </div>
                        <Link className='flex items-center text-sm rounded-xl gap-1 bg-primary-light px-2! py-1!' to={`/school/${currentUser.schoolId}`}>View school <FiExternalLink /></Link>
                    </div>
                ) : (
                    "without school"
                )}
            </div>}


            {role === 'student' && <div className="flex flex-col min-w-full text-xl items-center justify-between gap-4 bg-white rounded-2xl shadow-xl p-5!">
                <div className="text-xl w-full">
                    <h1 className='flex items-center gap-2 mb-1!'><MdOutlineSchool className='text-primary-light' /> Class Information</h1>
                    <p className='text-sm'>Your current class assignment</p>
                </div>

                <div className="w-full flex flex-row items-center justify-between bg-secondary-light px-4! py-2! rounded-2xl text-black">
                    {currentUser && currentUser?.classId ? (
                        <div className="text-lg flex items-center justify-between w-full">
                            <div className="">
                                <p className='font-medium'>Class {currentUser.class?.num} {currentUser.class?.letter}</p>
                                <p className='text-sm'>school's title: {currentUser.class?.school.title}</p>
                            </div>
                            <Link className='flex items-center text-sm rounded-xl gap-1 bg-primary-light px-2! py-1!' to={`/class/${currentUser.class?.id}`}>View class <FiExternalLink /></Link>
                        </div>
                    )
                        : "without class"}

                </div>

                <Link className='w-full flex items-center justify-center text-sm rounded-xl gap-1 bg-primary-light px-2! py-1!' to={'/marks'}>See your marks</Link>
            </div>}


            {role === 'student' && (
                <div className="flex flex-col min-w-full text-xl items-center justify-between gap-2 bg-white rounded-2xl shadow-xl p-5!">
                    <div className="text-xl w-full">
                        <h1 className='flex items-center gap-2 mb-1!'><RiParentFill className='text-primary-light' /> Parents / Guardians</h1>
                        <p className='text-sm'>Connected parent accounts</p>
                    </div>

                    <div className='flex flex-col items-start w-full gap-3'>
                        {currentUser && currentUser?.parents && currentUser?.parents.length > 0 ? (
                            currentUser?.parents.map(parentEl => (
                                <div key={parentEl.id} className="flex text-sm items-center gap-2 justify-between w-full">
                                    <Avatar className=''>
                                        <AvatarImage src={`http://localhost:3000${currentUser?.avatarUrl}`} />
                                        <AvatarFallback>avatarUrl</AvatarFallback>
                                    </Avatar>

                                    <div className="flex flex-col items-start">
                                        <h1>{parentEl.name} {parentEl.surname}</h1>
                                        <p>{parentEl.email}</p>
                                    </div>

                                    <Link className='flexbg-secondary-light px-4! py-2! rounded-2xl text-black' to={`/profile/${parentEl.id}`}>View parent</Link>
                                </div>
                            ))
                        ) : "no parents"}
                    </div>
                </div>
            )}

            {role === 'admin' && (
                <>
                    <Button className='p-3! cursor-pointer' onClick={handleFetchUsers} variant={'outline'}>{showUsers ? "Hide" : "Show"} users</Button>

                    {showUsers && <div className="flex flex-col min-w-full text-xl items-center justify-between gap-2 bg-white rounded-2xl shadow-xl p-5!">
                        <ul className="w-full flex flex-col gap-3">
                            {showUsers && users?.map(userEl => <li key={userEl.id} className='flex flex-row items-center justify-between gap-4'>
                                <Link to={`http://localhost:5173/profile/${userEl.id}`}>
                                    <div className="flex flex-col items-start text-sm">
                                        <h1>{userEl.name} {userEl.surname}</h1>
                                        <p>{userEl.email}</p>
                                    </div>
                                </Link>

                                <Button variant={"destructive"} onClick={() => handleDeleteUserByAdmin({ id: userEl.id })} className='w-[100px]'>Delete user</Button>
                            </li>)}
                        </ul>
                    </div>}
                </>
            )}

            <Button className='p-3! cursor-pointer' onClick={handleDeleteUser} variant={'destructive'}>Delete my account</Button>
        </div>
    )
}

export default Profile