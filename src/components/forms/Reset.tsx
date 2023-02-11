import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { AiFillLock } from 'react-icons/ai'
import { useEffect, useState } from 'react'
import zxcvbn from 'zxcvbn'
import Link from 'next/link'
import axios from 'axios'
import { toast } from 'react-toastify'
import BeatLoader from 'react-spinners/BeatLoader'
import { useRouter } from 'next/router'
import Input from '../inputs/input'

const schema = z
  .object({
    password: z
      .string()
      .min(6, 'Le mot de passe doit contenir au moins 8 caractères'),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirm_password'],
  })

type FormSchemaType = z.infer<typeof schema>

interface IProps {
  token: string
}

export default function ResetForm({ token }: IProps) {
  const router = useRouter()
  const [passwordScore, setPasswordScore] = useState(0)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    setPasswordScore(validatePasswordStrength())
  }, [watch().password])

  const onSubmit: SubmitHandler<FormSchemaType> = async (values) => {
    try {
      const data = await axios.post('/api/auth/reset', {
        password: values.password,
        token,
      })
      toast.success(data.data.message)
      router.push('/auth')
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  const validatePasswordStrength = () => {
    const { password } = watch()
    return zxcvbn(password || '').score
  }

  const passwordStrong = () => {
    if (passwordScore <= 2) return 'bg-red-400'
    if (passwordScore < 4) return 'bg-yellow-400'
    return 'bg-green-500'
  }

  return (
    <div className="w-full px-12 py-4">
      <h2 className="text-center text-2xl font-bold tracking-wide text-gray-800">
        Modifiez votre mot de passe
      </h2>
      <p className="text-center text-sm text-gray-600 mt-2">
        Connectez-vous sans le changer ?
        <Link
          href="/auth"
          className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer px-1"
        >
          Connectez-vous
        </Link>
      </p>
      <form className="my-8 text-sm" onSubmit={handleSubmit(onSubmit)}>
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
        {watch().password && (
          <div className="flex mt-2">
            {Array.from(Array(5).keys()).map((span, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <span className=" w-1/5 px-1" key={i}>
                <div className={`h-2 rounded-xl ${passwordStrong()}`} />
              </span>
            ))}
          </div>
        )}
        <Input
          name="confirm_password"
          label="Confirmer votre mot de passe"
          type="password"
          Icon={AiFillLock}
          placeholder="Votre mot de passe"
          register={register}
          error={errors?.confirm_password?.message}
          disabled={isSubmitting}
        />
        <button
          className="bg-blue-600 text-white w-full p-2 rounded-lg mt-2"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <BeatLoader color="white" />
          ) : (
            'Modifier votre mot de passe'
          )}
        </button>
      </form>
    </div>
  )
}
