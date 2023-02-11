import Link from 'next/link'
import { NextPageContext } from 'next'
import Register from '@/components/forms/Register'
import Background from '@/components/Backgrounds/background'
import Login from '@/components/forms/Login'

interface IProps {
  tab: string
}

export default function Auth({ tab }: IProps) {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full h-100 flex items-center justify-center">
        <div className="w-full sm:w-5/6 md:w-2/3 lg:w-1/2 xl:w-1/3 h-full bg-white flex items-center justify-center">
          {/* <Register /> */}
          {tab === 'signin' ? <Login /> : <Register />}
        </div>
        <Background image={`${tab === 'signin' ? 'login' : 'register'}.png`} />
      </div>
    </div>
  )
}

export async function getServerSideProps(context: NextPageContext) {
  const { req, query } = context
  const tab = query.tab ?? 'signin'
  return {
    // props: { tab: JSON.parse(JSON.stringify(tab)) },
    props: { tab },
  }
}
