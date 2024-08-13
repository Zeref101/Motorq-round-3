'use client';

import Image from 'next/image';
import React from 'react';
import heavyDriver from "/public/images/driver.jpeg";
import { Button } from './ui/button';
import Link from 'next/link';
const LocalStorageInfo = ({ user }: { user: any }) => {

    React.useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            console.log("DONEEEEEEEEEEEEEEE");
        }
    }, [user]);

    return (
        <div className='w-full h-[65vh] bg-black flex justify-center items-center rounded-md gap-8'>
            <div className='flex flex-col'>
                <div className='text-white text-[30px] font-bold'>
                    Drive when you want, <br /> make what you need
                </div>
                <Link href={"/dashboard"}>
                    <Button className='bg-blue-500 mt-4' >
                        Get Started
                    </Button>
                </Link>
            </div>

            <div>
                <Image src={heavyDriver} alt='driver' width={300} height={300} className='rounded-md' />
            </div>
        </div>
    );
};

export default LocalStorageInfo;