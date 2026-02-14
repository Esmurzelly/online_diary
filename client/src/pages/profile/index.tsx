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
import Loader from '@/components/items/Loader';
import ButtonMailto from '@/components/items/buttonMailTo';
import ButtonPhoneTo from '@/components/items/buttonPhoneTo';
import type { Parent, Student, Teacher } from '@/types';

type FormValues = {
    email: string;
    name: string;
    password: string;
    surname: string;
    phone: string | undefined | null;
    address: string | undefined | null;
    avatarUrl: string;
}

const Profile: React.FC = () => {
    const { currentUser, role, message, users, loading } = useSelector((state: RootState) => state.user);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [showChildren, setShowChildren] = useState(false);
    const [childId, setChildId] = useState<string | undefined>();
    const [showUsers, setShowUsers] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const filePickerRef = useRef<HTMLInputElement>(null);

    const {
        handleSubmit,
        register,
        watch,
    } = useForm<FormValues>({
        defaultValues: {
            name: currentUser?.name || "",
            surname: currentUser?.surname || "",
            password: "",
            email: currentUser?.email || "",
            phone: currentUser?.phone || "",
            address: currentUser?.address || "",
        },
    });

    const handleAvatarClick = () => {
        filePickerRef.current?.click();
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader();
        const selectedFile = e.target.files?.[0];

        if (!selectedFile || !currentUser?.id || !role) return;

        try {
            reader.readAsDataURL(selectedFile);
            setSelectedFile(selectedFile);

            const formData = new FormData();
            formData.append("avatar", selectedFile);

            await dispatch(updateUser({ formData, id: currentUser?.id, role })).unwrap();
            await dispatch(getMe()).unwrap();
        } catch (error) {
            console.error('Error updating avatar:', error);
            toast.error('Failed to update avatar');
        }

    };

    const handleDeleteUser = async () => {
        if (!currentUser?.id || !role) return;

        try {
            await dispatch(removeUser({ id: currentUser?.id, role })).unwrap();

            toast.success('Account deleted successfully');
            navigate('/auth');
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Failed to delete account');
        }
    };

    const handleSubmitForm: SubmitHandler<FormValues> = async (data) => {
        if (!currentUser?.id || !role) return;

        try {
            const formData = new FormData();
            formData.append("name", watch('name'));
            formData.append("surname", watch('surname'));
            formData.append("email", watch('email'));

            if (data.phone) formData.append('phone', data.phone);
            if (data.address) formData.append('address', data.address);

            if (watch('password') && watch('password').length > 0) {
                formData.append("password", watch('password'));
            }

            await dispatch(updateUser({ formData, id: currentUser?.id, role })).unwrap();
            await dispatch(getMe()).unwrap();
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        }
    };

    const handleFetchUsers = async () => {
        try {
            await dispatch(getAllUsers()).unwrap();
            setShowUsers(state => !state);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to fetch users');
        }
    };

    const handleDeleteUserByAdmin = async ({ id }: { id: string }) => {
        try {
            await dispatch(removeUserByAdmin({ id })).unwrap();
            await dispatch(getAllUsers()).unwrap();
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Failed to delete user');
        }
    };

    const onAddParentToChild = async (studentId: string) => {
        if (!currentUser?.id || !childId) {
            toast.error('Please select a child');
            return;
        }

        try {
            await dispatch(addParentToChild({
                parentId: currentUser?.id,
                studentId,
            })).unwrap();
        } catch (error) {
            console.error('Error adding child:', error);
            toast.error('Failed to add child');
        }
    };

    const onRemoveParentToChild = async (studentId: string) => {
        if (!currentUser?.id) return;

        try {
            await dispatch(removeParentToChild({
                parentId: currentUser?.id,
                studentId,
            })).unwrap()
        } catch (error) {
            console.error('Error removing child:', error);
            toast.error('Failed to remove child');
        }
    };

    const handleUserIdChange = (studentId: string) => {
        setChildId(studentId)
    };

    // useEffect(() => {
    //     if (message) {
    //         toast(message)
    //     }
    // }, []);

    useEffect(() => {
        dispatch(getAllSchools());
    }, []);

    if (!currentUser || loading) {
        return <Loader />
    };

    const isStudent = (user: typeof currentUser): user is Student => {
        return 'classId' in user && 'grades' in user
    };

    const isParent = (user: typeof currentUser): user is Parent => {
        return 'childrenIds' in user && 'children' in user;
    };

    const isTeacher = (user: typeof currentUser): user is Teacher => {
        return 'schoolId' in user && 'subjects' in user;
    };

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
                                            className="col-span-2 h-8"
                                            {...register("name")}
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type='text'
                                            className="col-span-2 h-8"
                                            {...register("password")}
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="surname">Surname</Label>
                                        <Input
                                            id="surname"
                                            type='text'
                                            className="col-span-2 h-8"
                                            {...register("surname")}
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type='email'
                                            className="col-span-2 h-8"
                                            {...register("email")}
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="adress">Adress</Label>
                                        <Input
                                            id="adress"
                                            className="col-span-2 h-8"
                                            {...register("address")}
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            className="col-span-2 h-8"
                                            {...register("phone")}
                                        />
                                    </div>
                                </div>
                            </div>
                            <Button className='cursor-pointer px-2!' type='submit' disabled={role === undefined || role === 'none' || role === null || !role}>Change Data</Button>
                        </form>
                    </PopoverContent>
                </Popover>
            </div>

            <div className="flex flex-col min-w-full text-xl items-center justify-between gap-2 bg-white rounded-2xl shadow-xl p-5!">
                {
                    currentUser?.avatarUrl
                        ? <Avatar onClick={handleAvatarClick} className='size-28 cursor-pointer'>
                            <AvatarImage src={`http://localhost:3000${currentUser.avatarUrl}`} />
                            <AvatarFallback>avatarUrl</AvatarFallback>
                        </Avatar>

                        : <div onClick={handleAvatarClick} className="flex items-center justify-center uppercase cursor-pointer text-white text-3xl bg-secondary-dark w-28 h-28 rounded-full">
                            {currentUser.name?.[0] || "A"}
                            {currentUser.surname?.[0] || "A"}
                        </div>
                }
                <input
                    type="file"
                    accept="image/*"
                    hidden
                    ref={filePickerRef}
                    onChange={handleAvatarChange}
                />
                <p>{currentUser.name} {currentUser.surname}</p>

                <div className="space-y-2! text-center">
                    <p className='bg-secondary-dark text-secondary-light px-4! py-1! rounded-3xl text-sm capitalize'>{role}</p>
                    <ButtonMailto Icon={MdOutlineEmail} label={currentUser?.email} mailto={`mailto:${currentUser?.email}`} />
                    <ButtonPhoneTo Icon={MdOutlineLocalPhone} label={currentUser?.phone || "no phone"} tel={`tel:${currentUser?.phone}`} />
                    <p className='flex items-center gap-2 text-secondary-dark text-lg'><FaAddressBook /> {currentUser?.address || "no address"}</p>
                </div>

                {role === 'teacher' && <Link className='flex items-center text-sm rounded-xl gap-1 bg-primary-light px-4! py-1!' to={`/subjects`}>Subjects</Link>}
            </div>

            {isParent(currentUser) && (
                <div className="flex flex-col min-w-full text-xl items-center justify-between gap-2 bg-white rounded-2xl shadow-xl p-5!">
                    <div className="text-xl w-full">
                        <h1 className='flex items-center gap-2 mb-1!'><RiParentFill className='text-primary-light' /> Children</h1>
                        <p className='text-sm'>Connected children accounts</p>

                        <div className="">
                            <div className='flex flex-col items-start gap-2'>
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

                                                    {users?.filter((userEl: Student) => userEl.parentIds).map(userEl =>
                                                        <SelectItem key={userEl.id} className='w-full py-2! px-1!' value={userEl.id}>
                                                            {userEl.name}
                                                        </SelectItem>)}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>

                                        {/* @ts-ignore */}
                                        <Button className='px-2! cursor-pointer' onClick={() => onAddParentToChild(childId)} variant={'outline'}>Add Child</Button>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col items-start w-full gap-3'>
                        {currentUser && currentUser.children && currentUser.children.length > 0 ? (
                            currentUser.children.map(childrenEl => (
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
            )}

            {isTeacher(currentUser) && <div className="flex flex-col min-w-full text-xl items-center justify-between gap-4 bg-white rounded-2xl shadow-xl p-5!">
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

            {isStudent(currentUser) && <div className="flex flex-col min-w-full text-xl items-center justify-between gap-4 bg-white rounded-2xl shadow-xl p-5!">
                <div className="text-xl w-full">
                    <h1 className='flex items-center gap-2 mb-1!'><MdOutlineSchool className='text-primary-light' /> Class Information</h1>
                    <p className='text-sm'>Your current class assignment</p>
                </div>

                <div className="w-full flex flex-row items-center justify-between bg-secondary-light px-4! py-2! rounded-2xl text-black">
                    {currentUser && currentUser?.classId ? (
                        <div className="text-lg flex items-center justify-between w-full">
                            <div className="">
                                <p className='font-medium'>Class {currentUser.class?.num} {currentUser.class?.letter}</p>
                                <p className='text-sm'>school's title: {currentUser.class && currentUser.class.school && currentUser.class?.school.title}</p>
                            </div>
                            <Link className='flex items-center text-sm rounded-xl gap-1 bg-primary-light px-2! py-1!' to={`/class/${currentUser.class?.id}`}>View class <FiExternalLink /></Link>
                        </div>
                    )
                        : "without class"}
                </div>

                <Link className='w-full flex items-center justify-center text-sm rounded-xl gap-1 bg-primary-light px-2! py-1!' to={'/marks'}>See your marks</Link>
            </div>}

            {isStudent(currentUser) && <div className="flex flex-col min-w-full text-xl items-center justify-between gap-2 bg-white rounded-2xl shadow-xl p-5!">
                <div className="text-xl w-full">
                    <h1 className='flex items-center gap-2 mb-1!'><RiParentFill className='text-primary-light' /> Parents / Guardians</h1>
                    <p className='text-sm'>Connected parent accounts</p>
                </div>

                <div className='flex flex-col items-start w-full gap-3'>
                    {currentUser && currentUser?.parents && currentUser?.parents.length > 0 ? (
                        currentUser?.parents.map(parentEl => (
                            <div key={parentEl.id} className="flex text-sm items-center gap-2 justify-between w-full">
                                <Avatar className=''>
                                    <AvatarImage src={`http://localhost:3000${parentEl?.avatarUrl}`} />
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
            </div>}

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