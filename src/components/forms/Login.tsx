import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { AiFillLock, AiOutlineMail } from 'react-icons/ai'
import { toast } from 'react-toastify'
import BeatLoader from 'react-spinners/BeatLoader'
import { useRouter } from 'next/router'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import Input from '../inputs/input'

const schema = z.object({
  email: z.string().email("L'email doit être valide"),
  password: z
    .string()
    .min(6, 'Le mot de passe doit contenir au moins 8 caractères'),
})

type FormSchemaType = z.infer<typeof schema>

interface IProps {
  callbackUrl: string
  csrfToken: string
}

export default function Login({ callbackUrl, csrfToken }: IProps) {
  const router = useRouter()
  const { pathname } = router
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
  })

  const onSubmit: SubmitHandler<FormSchemaType> = async (values) => {
    // try {
    //   await signIn('credentials', {
    //     redirect: true,
    //     email: values.email,
    //     password: values.password,
    //     callbackUrl,
    //   })
    //   toast.success('Vous êtes connecté !')
    // } catch (error) {
    //   toast.error(error)
    // }
    const res = await signIn('credentials', {
      redirect: false,
      email: values.email,
      password: values.password,
      callbackUrl,
    })
    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success('Vous êtes connecté !')
      router.push(callbackUrl)
    }
  }

  return (
    <div className="w-full px-12 py-4">
      <h2 className="text-center text-2xl font-bold tracking-wide text-gray-800">
        Connexion
      </h2>
      <p className="text-center text-sm text-gray-600 mt-2">
        Vous n&apos;avez pas de compte ?
        <button
          type="button"
          onClick={() => {
            router.push({
              pathname,
              query: {
                tab: 'signup',
              },
            })
          }}
          className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer px-1"
        >
          Inscrivez-vous
        </button>
      </p>
      <form
        method="post"
        action="/api/auth/signin/email"
        className="my-8 text-sm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input type="hidden" name="csrfToken" defaultValue={csrfToken} />
        <Input
          name="email"
          label="Email"
          type="text"
          Icon={AiOutlineMail}
          placeholder="monadresse@adresse.com"
          register={register}
          error={errors?.email?.message}
          disabled={isSubmitting}
        />
        <Input
          name="password"
          label="Mot de passe"
          type="password"
          Icon={AiFillLock}
          placeholder="Votre mot de passe"
          register={register}
          error={errors?.password?.message}
          disabled={isSubmitting}
        />
        <div className="mt-2">
          <Link className=" text-blue-600 hover:underline" href="/forgot">
            Mot de passe oublié ?
          </Link>
        </div>

        <button
          className="bg-blue-600 text-white w-full p-2 rounded-lg mt-4"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? <BeatLoader color="white" /> : 'Connexion'}
        </button>
      </form>
    </div>
  )
}
