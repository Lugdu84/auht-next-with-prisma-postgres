import { signIn } from 'next-auth/react'
import { FaDiscord, FaFacebook, FaGithub, FaGoogle } from 'react-icons/fa'
import clsx from 'clsx'

interface IProps {
  id: string
  text: string
  csrfToken: string
}

const colors: any = {
  google: 'bg-red-500',
  facebook: 'bg-blue-500',
  github: 'bg-gray-800',
  discord: 'bg-purple-500',
}

export default function SocialButton({ id, text, csrfToken }: IProps) {
  const createIconJsx = () => {
    switch (id) {
      case 'google':
        return <FaGoogle size={24} />
      case 'facebook':
        return <FaFacebook size={24} />
      case 'github':
        return <FaGithub size={24} />
      case 'discord':
        return <FaDiscord size={24} />
      default:
        return null
    }
  }
  return (
    <form method="post" action={`/api/auth/signin/${id}`}>
      <input type="hidden" name="csrfToken" defaultValue={csrfToken} />
      <button
        className={clsx(
          'mb-2 py-2 px-4 flex justify-center items-center gap-2 hover:bg-gray-700 text-base font-semibold shadow-md  rounded-lg text-white',
          colors[id],
          'w-full'
        )}
        type="button"
        onClick={() => signIn(id)}
      >
        {createIconJsx()}
        {text}
      </button>
    </form>
  )
}
