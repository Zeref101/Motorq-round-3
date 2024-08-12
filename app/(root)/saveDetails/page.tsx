import React from 'react'
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from 'next/navigation';
import { extractDriverData } from '@/lib/functions';
import { createDriver } from '@/lib/actions/driver.action';
import LocalStorageInfo from '@/components/LocalStorageInfo';

const page = async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    const driverData = extractDriverData(user);
    const driver = await createDriver(driverData);

    if (user) {
        return redirect("/");
    }
    return (
        <div>
            <LocalStorageInfo user={driver} />
        </div>
    )
}

export default page
