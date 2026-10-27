import { Link } from 'react-router-dom'

export default function RouteError() {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 text-center">
      <title>Page not found | Kabah’s Blog</title>
      <h1 className="font-serif text-4xl font-medium">This page doesn’t exist</h1>
      <p className="mt-3 text-muted">The link may be mistyped or out of date.</p>
      <Link to="/" className="btn btn-primary mt-7">
        Go to the latest stories
      </Link>
    </div>
  )
}
