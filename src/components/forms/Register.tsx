import { CiUser } from 'react-icons/ci'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import validator from 'validator'
import { AiFillLock, AiOutlineMail } from 'react-icons/ai'
import { BsTelephone } from 'react-icons/bs'
import Input from '../inputs/input'

const schema = z
  .object({
    first_name: z
      .string()
      .min(2, 'Le prénom doit contenir au moins 2 caractères')
      .max(32, 'Le prénom doit contenir au plus 32 caractères')
      .regex(/^[a-zA-ZÀ-ÿ]+$/, 'Le prénom ne peut contenir que des lettres'),
    last_name: z
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
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirm_password'],
  })

type FormSchemaType = z.infer<typeof schema>

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
  })

  console.log(watch())

  const onSubmit = (data) => console.log(data)
  return (
    <form className="my-8 text-sm" onSubmit={handleSubmit(onSubmit)}>
      <div className="gap-2 md:flex">
        <Input
          name="first_name"
          label="Prénom"
          type="text"
          Icon={CiUser}
          placeholder="David"
          register={register}
          error={errors?.first_name?.message}
          disabled={isSubmitting}
        />
        <Input
          name="last_name"
          label="Nom"
          type="text"
          Icon={CiUser}
          placeholder="Durand"
          register={register}
          error={errors?.last_name?.message}
          disabled={isSubmitting}
        />
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
      </div>
      <button type="submit">Créer</button>
    </form>
  )
}
