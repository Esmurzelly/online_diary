import React, { type JSX } from 'react'
import { Label } from '@/components/ui/label'
import { type IconType } from 'react-icons'

type Props = {
  register: any
  Icon?: IconType
  registerName: string
  inputType: string 
  topPosition?: number
  leftPosition?: number
  errorType: any
  title: string
}

const FormField = ({title, register, Icon, errorType, registerName, inputType, topPosition, leftPosition }: Props) => {
  return (
    <div className='relative flex flex-col'>
      <Label htmlFor="registerName">{title}:</Label>
      <input
        className='border rounded-xl pl-8! py-2! mt-2!'
        {...register(registerName, { required: `${registerName} is required` })}
        type={inputType}
        id={registerName}
      />
      {Icon && <Icon className={`w-4 absolute top-${topPosition || 8.5} left-${leftPosition || 3}`} />}
      {errorType && <span className='text-red-700'>{errorType.message}</span>}
    </div>
  )
}

export default FormField