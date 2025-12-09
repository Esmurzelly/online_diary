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
import { updateUser } from '@/redux/user/userSlice';
import { toast } from 'react-toastify';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
    const { currentUser, role, message } = useSelector((state: RootState) => state.user);
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

    // const [name, setName] = useState(currentUser?.name);
    // const [surname, setSurname] = useState(currentUser?.surname);
    // const [email, setEmail] = useState(currentUser?.email);
    // const [phone, setPhone] = useState(currentUser?.phone);
    // const [address, setAddress] = useState(currentUser?.address);

    const filePicekerRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleAvatarClick = () => {
        filePicekerRef.current?.click();
    };


    const handleAvatarChange = (e) => {
        const reader = new FileReader();
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            reader.readAsDataURL(selectedFile);
            setSelectedFile(selectedFile);
        }

        // reader.onload = (readerEvent) => {
        //     if (selectedFile.type.includes("image")) {
        //         console.log("readerEvent.target.result", readerEvent.target.result);
        //     }
        // };

        console.log('selectedFile', selectedFile)
        console.log('filePicekerRef', filePicekerRef);
    }

    useEffect(() => {
        if (message) {
            toast(message)
        }
    }, [message]);

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

            console.log('selectedFile', selectedFile);

            const res = await dispatch(updateUser({ formData, id: currentUser?.id, role }));
            console.log('res from form in client', res);
        } catch (error) {
            console.log(`error in handleSubmit - ${error}`);
        }
    }

    if (!currentUser?.id) {
        return <h1>Loading...</h1>
    }

    return (
        <div className='min-w-screen flex justify-center items-center'>
            {/* <h1>Your profile:</h1> */}

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
            </div>

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
                                    // onChange={(e) => setPassword(e.target.value)}
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
                                    <Label htmlFor="avatar">Avatar</Label> {/* change avatar */}
                                    <Button onClick={handleAvatarClick}>Change avatar</Button>
                                    {/* <Input
                                        id="avatar"
                                        className="hidden"
                                        ref={filePicekerRef}
                                        type='file'
                                        accept='image/*'
                                    /> */}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        ref={filePicekerRef}
                                        // onChange={handleAvatarChange}
                                        onChange={handleAvatarChange}
                                    />
                                </div>

                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
                <input disabled={role === undefined || !role} type="submit" />
            </form>
        </div>
    )
}

export default Profile