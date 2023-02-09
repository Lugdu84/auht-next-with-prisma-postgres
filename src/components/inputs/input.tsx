import React from 'react'
import { IconBaseProps } from 'react-icons'
import { IoAlertCircle } from 'react-icons/io5'

interface InputProps {
  type: string
  name: string
  label: string
  placeholder: string
  Icon: React.FC<IconBaseProps>
  register: any
  error: any
  disabled: boolean
}

function Input(props: InputProps) {
  const { type, name, label, placeholder, Icon, register, error, disabled } =
    props
  return (
    <div className="mt-3">
      <label htmlFor={name} className=" text-gray-700">
        {label}
      </label>
      <div className="relative mt-1 rounded-md">
        <div
          className="pointer-event-none absolute left-0 inset-y-0 flex items-center pl-3"
          style={{ transform: `${error ? 'translateY(-12px)' : ''}` }}
        >
          <span className="text-gray-500 text-sm">
            <Icon />
          </span>
        </div>
        <input
          type={type}
          placeholder={placeholder}
          className="w-full py-2 pr-7 pl-8 block rounded-md border border-gray-600  outline-offset-5 outline-gray-800 focus:outline-blue-600 text-sm focus:border-transparent"
          {...register(name)}
          disabled={disabled}
          style={{ borderColor: error ? '#ED4337' : '#4F46E5' }}
        />
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

export default Input
