import { NextPageContext } from 'next'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
// eslint-disable-next-line import/no-unresolved
import ButtonWithAction from '@/components/buttons/buttonWithAction'

type Props = {
  token: string
}

export default function Activate({ token }: Props) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  useEffect(() => {
    activateAcccount()
  }, [])

  const activateAcccount = async () => {
    try {
      const { data } = await axios.put('/api/auth/activate', { token })
      setSuccess(data.message)
    } catch (err) {
      setError(err?.response?.data?.message)
    }
  }
  // TODO: error and success messages together
  return (
    <div className=" bg-gradient-to-br from-gray-200 via-gray-400 to-gray-600 h-screen flex flex-col items-center justify-center space-y-2">
      {error && <p className="text-red-500 text-xl">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <ButtonWithAction
        title="Se connecter"
        onClick={() => router.push('/auth')}
      />
    </div>
  )
}

export async function getServerSideProps(context: NextPageContext) {
  const { token } = context.query
  return {
    props: { token },
  }
}
