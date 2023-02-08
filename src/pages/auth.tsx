import Link from 'next/link'
import Register from '@/components/forms/Register'

export default function Auth() {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full h-100 flex items-center justify-center">
        <div className="w-full sm:w-5/6 md:w-2/3 lg:w-1/2 xl:w-1/3 h-full bg-white flex items-center justify-center">
          <div className="w-full px-12 py-4">
            <h2 className="text-center text-2xl font-bold tracking-wide text-gray-800">
              S&apos;inscrire
            </h2>
            <p className="text-center text-sm text-gray-600 mt-2">
              Vous avez déjà un compte ?
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer px-1"
              >
                Connectez-vous
              </Link>
            </p>
            <Register />
          </div>
        </div>
      </div>
    </div>
  )
}
