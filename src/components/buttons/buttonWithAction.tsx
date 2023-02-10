type Props = {
  title: string
  onClick: () => void
}

export default function ButtonWithAction({ title, onClick }: Props) {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-md uppercase font-bold px-8 py-2 rounded-md sm:mr-2 mb-1 ease-linear transition-all duration-150"
      onClick={onClick}
      type="button"
    >
      {title}
    </button>
  )
}
