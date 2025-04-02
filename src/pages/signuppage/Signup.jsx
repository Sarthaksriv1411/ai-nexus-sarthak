import { SignUp } from '@clerk/clerk-react'
import React from 'react'

const Signup = () => {
    return (
        <div className=' flex justify-center items-center'>
            <SignUp path="/sign-up"
                signInUrl='/sign-in'
            />
        </div>
    )
}

export default Signup