/* eslint-disable import/no-unresolved */
import { NextPageContext } from 'next'
import { getCsrfToken, getProviders } from 'next-auth/react'
import Register from '@/components/forms/Register'
import Background from '@/components/Backgrounds/background'
import Login from '@/components/forms/Login'
import SocialButton from '@/components/buttons/socialButton'

interface IProps {
  tab: string
  callbackUrl: string
  csrfToken: string
  providers: any
}

export default function Auth({
  tab,
  callbackUrl,
  csrfToken,
  providers,
}: IProps) {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full h-100 flex items-center justify-center">
        <div className="w-full sm:w-5/6 md:w-2/3 lg:w-1/2 xl:w-1/3 h-full bg-white flex flex-col items-center justify-center">
          {tab === 'signin' ? (
            <Login callbackUrl={callbackUrl} csrfToken={csrfToken} />
          ) : (
            <Register />
          )}
          <div className=" w-full flex items-center justify-between px-12 ">
            <div className="w-full h-[1px] bg-gray-300 " />
            <span className="text-sm uppercase mx-6 text-gray-400">Or</span>
            <div className="w-full h-[1px] bg-gray-300 " />
          </div>
          <div className=" mt-5 sm:grid sm:grid-cols-2 gap-2 w-10/12 ">
            {providers.map((provider: any) => {
              if (provider.name === 'Credentials') return
              // eslint-disable-next-line consistent-return
              return (
                <SocialButton
                  key={provider.id}
                  id={provider.id}
                  text={
                    tab === 'signin'
                      ? `Se connecter avec ${provider.name}`
                      : `S'inscrire avec ${provider.name}`
                  }
                  csrfToken={csrfToken}
                />
              )
            })}
          </div>
        </div>
        <Background image={`${tab === 'signin' ? 'login' : 'register'}.png`} />
      </div>
    </div>
  )
}

export async function getServerSideProps(context: NextPageContext) {
  const { query } = context
  const tab = query.tab ?? 'signin'
  const callbackUrl = query.callbackUrl ?? process.env.NEXTAUTH_URL
  const csrfToken = await getCsrfToken(context)
  const providers = await getProviders()
  return {
    // props: { tab: JSON.parse(JSON.stringify(tab)) },
    props: {
      tab,
      callbackUrl,
      csrfToken,
      providers: Object.values(providers ?? []),
    },
  }
}
