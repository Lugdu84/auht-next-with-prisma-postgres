import { NextPageContext } from 'next'
import { getSession, useSession } from 'next-auth/react'
import { FormEvent, useState } from 'react'
import axios from 'axios'
import { List } from '@prisma/client'
import prisma from '@/lib/prismadb'

interface IListsProps {
  lists: List[]
}

export default function Lists({ lists }: IListsProps) {
  const { data: session } = useSession()
  const [listes, setListes] = useState<List[]>(lists)

  const addList = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const input = e.currentTarget[0] as HTMLInputElement
    if (!input.value) return
    await axios
      .post('/api/lists', {
        name: input.value,
        userId: session?.user.id,
      })
      .then((res) => {
        setListes([
          ...listes,
          {
            // eslint-disable-next-line no-underscore-dangle
            id: res.data.id,
            name: res.data.name,
            userId: res.data.userId,
          },
        ])
        input.value = ''
      })
  }

  const handleDelete = async (listId: string) => {
    await axios
      .delete(`/api/lists/${listId}`, {
        data: {
          userId: session?.user.id,
        },
      })
      .then(() => {
        setListes(listes.filter((list) => list.id !== listId))
      })
  }
  return (
    <div className=" h-screen relative mt-5 flex items-center flex-col">
      <h1 className="text-4xl">Mes Listes</h1>
      <form onSubmit={addList}>
        <input
          name="nameList"
          placeholder="Ajouter une liste"
          type="text"
          className="border border-green-600 rounded-lg px-3 py-2  focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      </form>

      {listes?.map((list) => (
        // eslint-disable-next-line no-underscore-dangle
        <div
          className="flex w-1/2 justify-between items-center justify-items-center bg-yellow-50 m-3 shadow-xl px-2 py-4 rounded-lg"
          key={list.id}
        >
          <h2>{list.name}</h2>{' '}
          <button
            onClick={() => handleDelete(list.id)}
            className="text-white bg-red-600 p-1 rounded-full w-8 h-8"
            type="button"
          >
            X
          </button>
        </div>
      ))}
    </div>
  )
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context)

  const lists = await prisma.list.findMany({
    where: {
      userId: session?.user.id,
    },
  })
  return {
    props: { lists },
  }
}
