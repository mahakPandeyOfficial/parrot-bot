import React from 'react'
import './login.css'
import { SignIn } from '@clerk/clerk-react'

const Login = () => {
  return (
    <div className='login'>
      <SignIn path="/sign-in" signUpUrl="/sign-up" forceRedirectUrl="/dashboard"/>
    </div>
  )
}

export default Login
