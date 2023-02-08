import { CiUser } from 'react-icons/ci'
import Input from '../inputs/input'

export default function Register() {
  return (
    <form className="my-8 text-sm">
      <div className="gap-2 md:flex">
        <Input
          name="first_name"
          label="First name"
          type="text"
          Icon={CiUser}
          placeholder="exemple"
        />
      </div>
    </form>
  )
}
