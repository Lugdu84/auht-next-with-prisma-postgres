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
        className="w-full py-2 pr-7 pl-8 block rounded-md border border-gray-500 outline-offset-2 outline-transparent focus:border-blue-500 focus:ring-blue-600 focus:ring-2 text-sm"
      />
    </div>
  )
}

export default Input
