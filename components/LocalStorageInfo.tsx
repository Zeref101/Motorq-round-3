'use client';

import React from 'react'

const LocalStorageInfo = ({ user }: { user: any }) => {
    React.useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            console.log("DONEEEEEEEEEEEEEEE")
        }
    }, [user]);

    return (
        <div>
            <h1>Driver Information</h1>
            <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
    )
}

export default LocalStorageInfo
