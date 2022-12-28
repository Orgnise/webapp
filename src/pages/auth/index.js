import { lazy } from 'react'
const Login = lazy(() => import('./login.page'))
const Signup = lazy(() => import('./signup.page'))

export { Login, Signup }
