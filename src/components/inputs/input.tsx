import React, { useState } from 'react'
import { IconBaseProps } from 'react-icons'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { IoAlertCircle } from 'react-icons/io5'

interface IInputRequiredProps {
  type: string
  name: string
  label: string
  placeholder: string
  Icon: React.FC<IconBaseProps>
  register: any
  error: any
  disabled: boolean
}

interface IInputOptionalProps {
  className?: string
}

const defaultProps: IInputOptionalProps = {
  className: '',
}

interface IInputProps extends IInputRequiredProps, IInputOptionalProps {}

function Input({
  type,
  name,
  label,
  placeholder,
  Icon,
  register,
  error,
  disabled,
  className,
}: IInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  // const calulateTranslate = (): string => {
  //   if (name === 'first_name' || name === 'last_name') {
  //     return 'translateY(-22px)'
  //   }
  //   return 'translateY(-12px)'
  // }

  return (
    <div className={`mt-3 ${className}`}>
      <label htmlFor={name} className=" text-gray-700">
        {label}
      </label>
      <div className="relative mt-1 rounded-md items-center">
        <div
          className="flex items-center absolute top-6 left-0 pl-2"
          // style={{ transform: `${error ? 'translateY(-12px)' : ''}` }}
          style={{ transform: `translateY(-12px)` }}
        >
          <Icon className=" text-gray-500 pointer-event-none" />
        </div>

        <input
          type={showPassword ? 'text' : type}
          placeholder={placeholder}
          className="w-full py-2 pr-7 pl-7 block rounded-md border border-gray-600  outline-offset-5 outline-gray-800 focus:outline-blue-600 text-sm focus:border-transparent"
          {...register(name)}
          disabled={disabled}
          style={{ borderColor: error ? '#ED4337' : '#4F46E5' }}
        />
        {(name === 'password' || name === 'confirm_password') && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-2.5 right-2 text-xl text-gray-700 cursor-pointer"
            style={{ right: `${error ? '2.5rem' : ''}` }}
          >
            {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
          </button>
        )}
        {error && (
          <div className="fill-red-500 ">
            <IoAlertCircle
              fill="#ED4337"
              className="absolute right-2 top-2.5 text-xl"
            />
            <p className="text-sm text-[#ED4337] mt-1">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}

Input.defaultProps = defaultProps

export default Input
