import React from 'react'
import Image from 'next/image'
// import Link from "next/link";
import marker from "/public/icons/white-marker.png";

const Navbar = () => {
    return (
        <nav className='flex-between fixed z-50 w-[95%] bg-[#22283a] p-6 shadow-light-300 dark:shadow-none sm:px-12 rounded-md'>
            <div className='flex gap-4 justify-center items-center'>
                <Image src={marker} alt='marker' width={20} height={20} />
                <span className='text-white h2-bold'>FleetFusion</span>
            </div>
        </nav>
    )
}

export default Navbar
