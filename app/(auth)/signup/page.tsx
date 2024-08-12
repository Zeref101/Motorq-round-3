import React from 'react'
import { RegisterLink, } from "@kinde-oss/kinde-auth-nextjs/components";

const page = () => {
    return (
        <div>
            <RegisterLink postLoginRedirectURL="/">Sign up</RegisterLink>
        </div>
    )
}

export default page
