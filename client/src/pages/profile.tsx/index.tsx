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
import type { Parent } from '@/types';


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
        filePicekerRef.current?.click();
    };


    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader();
        const selectedFile = e.target.files?.[0];

        if (selectedFile) {
            reader.readAsDataURL(selectedFile);
            setSelectedFile(selectedFile);
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
        try {
            const formData = new FormData();
            formData.append("name", watch('name'));
            formData.append("surname", watch('surname'));
            formData.append("email", watch('email'));
            formData.append("phone", watch('phone'));
            formData.append("address", watch('address'));

            if (selectedFile) {
                formData.append("avatar", selectedFile);
            }
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
        <div className='min-w-screen flex flex-col justify-center items-center gap-3'>
            <div className="flex flex-col items-start gap-2">
                {
                    currentUser?.avatarUrl
                        ? <Avatar>
                            <AvatarImage src={`http://localhost:3000${currentUser?.avatarUrl}`} />
                            <AvatarFallback>avatarUrl</AvatarFallback>
                        </Avatar>
                        : "No image"
                }

                <p>role: {role}</p>
                <p>name: {currentUser?.name}</p>
                <p>surname: {currentUser?.surname}</p>
                <p>phone: {currentUser?.phone}</p>
                <p>address: {currentUser?.address}</p>
                <p>email: {currentUser?.email}</p>
                {role === 'parent' &&
                    <>
                        <p>Children:
                            {currentUser && currentUser?.children && currentUser?.children.length > 0
                                && (
                                    <>
                                        {currentUser?.children.map(childrenEl =>
                                            <div className='flex items-center gap-3'>
                                                <span key={childrenEl.id}>{childrenEl.name}</span>
                                                <Button onClick={() => onRemoveParentToChild(childrenEl.id)} size={'sm'} variant={'outline'}>
                                                    Remove Child
                                                </Button>
                                            </div>
                                        )}

                                        <div className='flex items-center gap-2'>
                                            <Button onClick={() => setShowChildren(state => !state)}>{showChildren ? "Hide" : "Show"} children</Button>
                                        </div>
                                    </>
                                )
                            }
                        </p>
                        {showChildren && <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select the parent" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Parents</SelectLabel>

                                    {/* mutable array? */}
                                    {users?.filter(userEl => userEl.parentIds).map(userEl =>
                                        <SelectItem className='w-full' value={userEl.id}>
                                            {userEl.name} - <Button onClick={() => onAddParentToChild(userEl.id)} variant={'outline'}>Add Child</Button>
                                        </SelectItem>)}
                                </SelectGroup>
                            </SelectContent>
                        </Select>}
                    </>
                }

                {role === 'teacher' && <p>school: {currentUser && currentUser?.schoolId ? <Link to={`/school/${currentUser.schoolId}`}>{currentUser.school?.title}</Link> : "without school"}</p>}
                {role === 'student' && <p>school: {currentUser && currentUser?.classId ? <Link to={`/class/${currentUser.class.id}`}>{currentUser.class.school.title} / {currentUser.class.num} - {currentUser.class.letter}</Link> : "without school"}</p>}
            </div>

            {role === 'admin' || role === 'teacher' && <Link to={`/subjects`}>Subjects</Link>}

            <form onSubmit={handleSubmit(handleSubmitForm)}>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline">Open popover</Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-80'>
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
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor="avatar">Avatar</Label>
                                    <Button onClick={handleAvatarClick}>Change avatar</Button>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        ref={filePicekerRef}
                                        onChange={handleAvatarChange}
                                    />
                                </div>

                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
                <input disabled={role === undefined || role === 'none' || role === null || !role} type="submit" />
            </form>

            <Button onClick={handleDeleteUser} variant={'destructive'}>Delete my account</Button>

            {role === 'admin' && <Button className='p-3' onClick={handleFetchUsers} variant={'outline'}>{showUsers ? "Hide" : "Show"} users</Button>}
            {/* {role === 'teacher' && <div>
                <Dialog>
                    <form>
                        <DialogTrigger asChild>
                            <Button variant="outline">Link to the school</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Link to the school</DialogTitle>
                                <DialogDescription>
                                    Add / change your school type: only for teachers and admins
                                </DialogDescription>
                            </DialogHeader>

                            <Select>
                                <SelectTrigger className="w-1/5">
                                    <SelectValue placeholder="Select a subject" />
                                </SelectTrigger>
                                <SelectContent>
                                    {schoolList?.map(schoolItem => <SelectItem value={schoolItem.id}>{schoolItem.title}</SelectItem>)}
                                </SelectContent>
                            </Select>

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button onSubmit={hadleLinkSchool} type="submit">Save changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </form>
                </Dialog>
            </div>} */}

            <ul className="bg-red-400 w-5xl flex flex-col gap-3">
                {showUsers && users?.map(userEl => <li key={userEl.id} className='flex flex-row items-center justify-between gap-4'>
                    <Link to={`http://localhost:5173/profile/${userEl.id}`}>
                        <span>{userEl.name} - {userEl.email}</span>
                    </Link>

                    <Button onClick={() => handleDeleteUserByAdmin({ id: userEl.id })} className='w-[100px]'>Delete user</Button>
                </li>)}
            </ul>
        </div>
    )
}

export default Profile