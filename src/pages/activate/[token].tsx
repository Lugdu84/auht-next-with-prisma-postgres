import { NextPageContext } from 'next'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { signIn } from 'next-auth/react'
import ButtonWithAction from '@/components/buttons/buttonWithAction'

type Props = {
  token: string
}

export default function Activate({ token }: Props) {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  useEffect(() => {
    activateAcccount()
  }, [token])

  const activateAcccount = async () => {
    try {
      const { data } = await axios.put('/api/auth/activate', { token })
      setSuccess(data.message)
    } catch (err) {
      setError(err?.response?.data?.message)
    }
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center space-y-2">
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}
      <ButtonWithAction title="Se connecter" onClick={signIn} />
    </div>
  )
}

export async function getServerSideProps(context: NextPageContext) {
  const { token } = context.query
  return {
    props: { token },
  }
}
