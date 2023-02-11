import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { AiOutlineMail } from 'react-icons/ai'
import { toast } from 'react-toastify'
import BeatLoader from 'react-spinners/BeatLoader'
import Link from 'next/link'
import axios from 'axios'
import Input from '../inputs/input'

const schema = z.object({
  email: z.string().email("L'email doit être valide"),
})

type FormSchemaType = z.infer<typeof schema>

export default function ForgotForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
  })

  const onSubmit: SubmitHandler<FormSchemaType> = async (values) => {
    try {
      const data = await axios.post('/api/auth/forgot', {
        email: values.email,
      })
      toast.success(data.data.message)
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  return (
    <div className="w-full px-12 py-4">
      <h2 className="text-center text-2xl font-bold tracking-wide text-gray-800">
        Mot de passe oublié
      </h2>
      <p className="text-center text-sm text-gray-600 mt-2">
        Se connecter à la place ?
        <Link
          href="/auth"
          className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer px-1"
        >
          Connexion
        </Link>
      </p>
      <form className="my-8 text-sm" onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" name="csrfToken" defaultValue="csrfToken" />
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
        <button
          className="bg-blue-600 text-white w-full p-2 rounded-lg mt-4"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? <BeatLoader color="white" /> : 'Envoyer '}
        </button>
      </form>
    </div>
  )
}
