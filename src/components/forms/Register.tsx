import { CiUser } from 'react-icons/ci'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { AiFillLock, AiOutlineMail } from 'react-icons/ai'
import { BsTelephone } from 'react-icons/bs'
import { useEffect, useState } from 'react'
import zxcvbn from 'zxcvbn'
import Link from 'next/link'
import axios from 'axios'
import { toast } from 'react-toastify'
import BeatLoader from 'react-spinners/BeatLoader'
import Input from '../inputs/input'

const schema = z
  .object({
    firstName: z
      .string()
      .min(2, 'Le prénom doit contenir au moins 2 caractères')
      .max(32, 'Le prénom doit contenir au plus 32 caractères')
      .regex(/^[a-zA-ZÀ-ÿ]+$/, 'Le prénom ne peut contenir que des lettres'),
    lastName: z
      .string()
      .min(2, 'Le nom doit contenir au moins 2 caractères')
      .max(32, 'Le nom doit contenir au plus 32 caractères')
      .regex(/^[a-zA-ZÀ-ÿ]+$/, 'Le nom ne peut contenir que des lettres'),
    email: z.string().email("L'email doit être valide"),
    phone: z
      .string()
      .regex(
        /^0[67]([-. ]?[0-9]{2}){4}$/,
        'Le numéro de téléphone est invalide'
      ),
    password: z
      .string()
      .min(6, 'Le mot de passe doit contenir au moins 8 caractères'),
    confirm_password: z.string(),
    accept: z.literal(true, {
      errorMap: () => ({
        message: "Vous devez accepter les conditions d'utilisation",
      }),
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirm_password'],
  })

type FormSchemaType = z.infer<typeof schema>

export default function Register() {
  const [passwordScore, setPasswordScore] = useState(0)
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    setPasswordScore(validatePasswordStrength())
  }, [watch().password])

  const onSubmit: SubmitHandler<FormSchemaType> = async (values) => {
    try {
      const data = await axios.post('/api/auth/signup', {
        ...values,
      })
      reset()
      toast.success(data.data.message)
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

  // if (isSubmitting)
  //   return (
  //     <div className=" h-screen flex justify-center items-center">
  //       <BeatLoader />
  //     </div>
  //   )

  return (
    <form className="my-8 text-sm" onSubmit={handleSubmit(onSubmit)}>
      <div className="gap-2 md:flex">
        <Input
          name="firstName"
          label="Prénom"
          type="text"
          Icon={CiUser}
          placeholder="David"
          register={register}
          error={errors?.firstName?.message}
          disabled={isSubmitting}
          className="md:w-1/2"
        />
        <Input
          name="lastName"
          label="Nom"
          type="text"
          Icon={CiUser}
          placeholder="Durand"
          register={register}
          error={errors?.lastName?.message}
          disabled={isSubmitting}
          className="md:w-1/2"
        />
      </div>
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
        name="phone"
        label="Numéro de téléphone"
        type="number"
        Icon={BsTelephone}
        placeholder="06-34-41-89-03"
        register={register}
        error={errors?.phone?.message}
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
      <div className="flex items-center mt-3">
        <input
          type="checkbox"
          id="accept"
          className="mr-2 focus:ring-0 rounded"
          {...register('accept')}
        />
        <Link
          href="/"
          target="_blank"
          className="text-blue-600 hover:text-blue-700 hover:underline"
        >
          J&apos;accepte les conditions d&apos;utilisation
        </Link>
      </div>
      <div>
        {errors?.accept?.message && (
          <span className="text-red-600 text-sm mt-1">
            {errors.accept.message}
          </span>
        )}
      </div>
      <button
        className="bg-blue-600 text-white w-full p-2 rounded-lg mt-2"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? <BeatLoader color="white" /> : 'Créer'}
      </button>
    </form>
  )
}
