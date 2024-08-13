'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image'
import { DriverLinks, AdminLinks } from '@/constant';

interface UserDetails {
    name: string;
    phone_number: number;
    location: string;
    email: string;
    working_hours: string[];
}


const LeftSidebar: React.FC = () => {
    const [userdetails, setUserdetails] = React.useState<UserDetails>({
        name: '',
        phone_number: 0,
        location: '',
        email: '',
        working_hours: [],
    });

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const user = JSON.parse(localStorage.getItem("user") || '{}') as UserDetails;
            setUserdetails(user);
        }
    }, []);


    return (
        <div className='w-[200px] h-[85%] bg-[#22283a] rounded-md fixed z-50 flex flex-col text-white gap-8 justify-center'>
            {(userdetails.email === "shreyasmohanty0228@gmail.com" ? AdminLinks : DriverLinks).map((driver) => (
                <Link href={driver.link} className='flex gap-4' key={driver.label}>

                    <span className=' text-white font-medium text-[25px] ml-5'>{driver.label}</span>
                </Link>
            ))}
        </div>
    );
};

export default LeftSidebar;