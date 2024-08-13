import React from 'react';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { extractDriverData } from '@/lib/functions';
import { createDriver } from '@/lib/actions/driver.action';
import LocalStorageInfo from '@/components/LocalStorageInfo';
// import MapmyIndia from 'mapmyindia-react';

const page = async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    const driverData = extractDriverData(user);
    const driver = await createDriver(driverData);

    if (driver === false) {
        console.log("already logged in")
    }


    return (
        <div>
            {/* <MapmyIndia /> */}
            <LocalStorageInfo user={driverData} />

        </div>
    )
}

export default page
