/* eslint-disable import/no-unresolved */
import { NextPageContext } from 'next'
import Background from '@/components/Backgrounds/background'
import ResetForm from '@/components/forms/Reset'

interface IProps {
  token: string
}
export default function Reset({ token }: IProps) {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full h-100 flex items-center justify-center">
        <div className="w-full sm:w-5/6 md:w-2/3 lg:w-1/2 xl:w-1/3 h-full bg-white flex flex-col items-center justify-center">
          <ResetForm token={token} />
        </div>
        <Background image="reset.png" />
      </div>
    </div>
  )
}

export async function getServerSideProps(context: NextPageContext) {
  const { token } = context.query
  return {
    props: { token },
  }
}
