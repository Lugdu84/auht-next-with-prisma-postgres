import Link from 'next/link'
import React from 'react'
import { IconBaseProps } from 'react-icons'

type Props = {
  href: string
  Icon: React.FC<IconBaseProps>
}

export default function SocialLink({ href, Icon }: Props) {
  return (
    <Link
      href={href}
      rel="noopener noreferrer"
      className="hover:scale-125 transition ease-in-out"
    >
      <Icon size={24} />
    </Link>
  )
}
