import Navbar from '@/components/Navbar/Navbar';
import LeftSidebar from '@/components/Sidebar/LeftSidebar';
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="background-light850_dark100 relative">
            <div className=' mx-8 pt-2'>
                <Navbar />
            </div>
            <div className="flex">
                <div className=' pl-8 pt-24'>

                    <LeftSidebar />
                </div>
                <section className="flex min-h-screen ml-20 flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14">
                    <div className="mx-auto w-3/4 ">{children}</div>
                </section>

            </div>
        </main>
    );
}

export default layout
