import React, { useState } from 'react'
import { IconBaseProps } from 'react-icons'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { IoAlertCircle } from 'react-icons/io5'

interface IInputProps {
  type: string
  name: string
  label: string
  placeholder: string
  Icon: React.FC<IconBaseProps>
  register: any
  error: any
  disabled: boolean
  // eslint-disable-next-line react/require-default-props
  className?: string
}

function Input(props: IInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const {
    type,
    name,
    label,
    placeholder,
    Icon,
    register,
    error,
    disabled,
    className,
  } = props
  return (
    <div className={`mt-3 ${className ?? ''}`}>
      <label htmlFor={name} className=" text-gray-700">
        {label}
      </label>
      <div
        className="flex flex-row border rounded-lg border-gray-500 items-center"
        style={{ borderColor: error ? '#ED4337' : '#4F46E5' }}
      >
        <Icon className="  text-gray-500 pl-1" size={22} />
        <input
          type={showPassword ? 'text' : type}
          placeholder={placeholder}
          className="w-full pr-1 py-2 pl-1  outline-none rounded-lg"
          {...register(name)}
          disabled={disabled}
          // style={{ borderColor: error ? '#ED4337' : '#4F46E5' }}
        />
        {(name === 'password' || name === 'confirm_password') && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className=" text-xl text-gray-700 cursor-pointer pr-1"
          >
            {showPassword ? (
              <AiFillEye size={32} />
            ) : (
              <AiFillEyeInvisible size={32} />
            )}
          </button>
        )}
        {error && <IoAlertCircle fill="#ED4337" className="pr-1" size={32} />}
      </div>
      {error && <p className="text-sm text-[#ED4337] mt-1">{error}</p>}
    </div>
  )
}

export default Input
