import React from 'react'
import { useRouteError } from 'react-router-dom'

export default function ErrorPage () {
  const error = useRouteError()
  console.error(error)

  return (
    <div className="h-screen w-full flex flex-col items-center place-content-center bg-white">
      <div className="p-10 rounded bg-slate-50 text-slate-700  border-l-4 border-yellow-500">
        <h1 className="font-semibold">Oops!</h1>
        <p className="font-medium">Sorry, an unexpected error has occurred.</p>
        <p className="font-light">
          <i>{error.statusText || error.message}</i>
        </p>
      </div>
    </div>
  )
}
