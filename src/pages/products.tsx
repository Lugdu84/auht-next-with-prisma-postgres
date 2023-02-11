import Link from 'next/link'

export default function Products() {
  return (
    <div>
      <h1>Products</h1>
      <Link
        href={{
          pathname: '/auth',
          query: {
            callbackUrl: '/products',
          },
        }}
      >
        Connexion
      </Link>
    </div>
  )
}
