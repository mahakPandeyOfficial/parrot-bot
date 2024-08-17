import React from 'react'
import './register.css'
import { SignUp } from '@clerk/clerk-react'

const Register = () => {
  return (
    <div className='register'>
      <SignUp path="/sign-up" signInUrl='/sign-in'/>
    </div>
  )
}

export default Register
