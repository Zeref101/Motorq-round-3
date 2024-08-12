import React from 'react'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation';
const page = async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) return redirect('/signin')
    else {
        console.log(user)
    }
    return (
        <div>
            Hey {user.given_name}
        </div>
    )
}

export default page
