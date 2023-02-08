import React from 'react'
import { IconBaseProps } from 'react-icons'

interface InputProps {
  type: string
  name: string
  label: string
  placeholder: string
  Icon: React.FC<IconBaseProps>
}

function Input({ type, name, label, placeholder, Icon }: InputProps) {
  return (
    <div className="relative mt-1 rounded-md shadow-sm">
      <div className="pointer-event-none absolute left-0 inset-y-0 flex items-center pl-3">
        <span className="text-gray-500 text-sm">
          <Icon />
        </span>
      </div>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full py-2 pr-7 pl-8 block rounded-md border border-gray-600  outline-offset-5 outline-gray-800 focus:outline-blue-600 text-sm focus:border-transparent"
      />
    </div>
  )
}

export default Input
