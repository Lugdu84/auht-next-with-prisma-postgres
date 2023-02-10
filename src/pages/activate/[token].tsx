import axios from 'axios'
import { NextPageContext } from 'next'
import { useEffect, useState } from 'react'

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
      setSuccess(data)
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <div>
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}
      <button type="button">Se connecter</button>
    </div>
  )
}

export async function getServerSideProps(context: NextPageContext) {
  const { token } = context.query
  return {
    props: { token },
  }
}
