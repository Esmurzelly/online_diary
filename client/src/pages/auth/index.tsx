import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from 'react-toastify'
import OAuth from '@/components/items/OAuth'
import { LuLogIn } from "react-icons/lu";
import { GiExitDoor } from "react-icons/gi";
import { PiStudent } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import { RiParentFill } from "react-icons/ri";
import { RiAdminLine } from "react-icons/ri";
import LoginComponent from '@/components/items/login';
import RegisterComponent from '@/components/items/register';

type Role = 'student' | 'teacher' | 'parent' | 'admin' | 'none';

interface RoleOption {
  value: Role;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
};

const ROLE_OPTIONS: RoleOption[] = [
  { value: 'student', label: 'Student', icon: PiStudent },
  { value: 'teacher', label: 'Teacher', icon: GiTeacher },
  { value: 'parent', label: 'Parent', icon: RiParentFill },
  { value: 'admin', label: 'Admin', icon: RiAdminLine },
];


const Auth: React.FC = () => {
  const [role, setRole] = useState<Role>('none');

  const handleChange = (selectedRole: Role) => {
    setRole(selectedRole);

    if (selectedRole !== 'none') {
      toast.info(`Selected role: ${selectedRole}`);
    };
  };

  return (
    <div className='w-screen flex items-center justify-center h-screen p-7! font-inter bg-secondary-light'>
      <div className="flex flex-col gap-7">
        <div className="flex flex-col gap-2 items-center text-center">
          <img src={'/logo.png'} className='w-32' alt="LogoPng" />
          <h1 className='text-2xl'>Online Diary</h1>
          <p className='text-xl'>School Management Platform</p>
        </div>

        <div className='w-full bg-white p-5! rounded-lg shadow-2xl'>
          <Select defaultValue='none' onValueChange={handleChange}>
            <SelectTrigger className="w-full h-11! px-4! cursor-pointer">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="cursor-not-allowed opacity-50" disabled value="none">Choose the role</SelectItem>

              {ROLE_OPTIONS.map(({ value, label, icon: Icon }) => (
                <SelectItem key={value} value={value} className='h-8! border rounded-none pl-2! cursor-pointer'>
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <OAuth role={role} />

          <div className='relative'>
            <div className='w-16 h-px bg-black absolute top-3 left-0 opacity-30'></div>
            <p className='mt-3! text-center uppercase'>or continue with</p>
            <div className='w-16 h-px bg-black absolute top-3 right-0 opacity-30'></div>
          </div>

          <div className="flex mt-3! max-w-full flex-col gap-6">
            <Tabs defaultValue="login" className='w-full'>
              <TabsList className='w-full flex flex-row items-center justify-center'>
                <TabsTrigger className='cursor-pointer' value="login">
                  <LuLogIn />
                  <p>Login</p>
                </TabsTrigger>

                <TabsTrigger className='cursor-pointer' value="register">
                  <GiExitDoor />
                  <p>Register</p>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className='w-full'>
                <Card className='p-3! w-full'>
                  <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Enter your data to Log In</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LoginComponent role={role} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="register">
                <Card className='p-3!'>
                  <CardHeader>
                    <CardTitle>Register</CardTitle>
                    <CardDescription>Enter your data to Create an account</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6">
                    <RegisterComponent role={role} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <p className='text-center mx-auto! mt-3! w-3/4 text-xs sm:text-sm'>By continuing, you agree to our Terms of Service and Privacy Policy</p>
      </div>
    </div>
  )
}

export default Auth