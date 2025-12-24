import React, { useEffect, useState } from 'react'
import LoginComponent from '../login'
import { Button } from "@/components/ui/button"
import RegisterComponent from '../register'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

type Props = {}

type Role = 'student' | 'teacher' | 'parent' | 'admin' | 'none';

const Auth = (props: Props) => {
  const [role, setRole] = useState<Role>('none');

  const handleChange = (state: Role) => {
    setRole(state);
    toast.info(`role is ${state}`)
  };

  console.log(import.meta.env.VITE_APP_FIREBASE_API_KEY)

  return (
    <>
      <Select defaultValue='none' onValueChange={handleChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Choose the role</SelectItem>
          <SelectItem value="student">student</SelectItem>
          <SelectItem value="teacher">teacher</SelectItem>
          <SelectItem value="parent">parent</SelectItem>
          <SelectItem value="admin">admin</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex w-full max-w-sm flex-col gap-6">
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Login</TabsTrigger>
            <TabsTrigger value="password">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Make changes to your account here. Click save when you&apos;re
                  done.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <LoginComponent role={role} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Register</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you&apos;ll be logged
                  out.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <RegisterComponent role={role} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <OAuth role={role} />
      </div>
    </>
  )
}

export default Auth