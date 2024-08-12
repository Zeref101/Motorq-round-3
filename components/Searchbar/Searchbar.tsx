'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { Input } from '../ui/input';
import search from '/public/icons/search.png';
import { searchDrivers } from '@/lib/actions/driver.action';

export interface Driver {
    name: string;
    phone_number: number;
}

const Searchbar = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Driver[]>([]);

    const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setQuery(query);

        if (query.length > 0) {
            try {
                const drivers = await searchDrivers(query);
                const formattedDrivers: Driver[] = drivers.map(driver => ({
                    name: driver.name,
                    phone_number: driver.phone_number,
                }));
                console.log("serching")
                setResults(formattedDrivers);
            } catch (error) {
                console.error('Error searching drivers:', error);
            }
        } else {
            setResults([]);
        }
    };

    return (
        <div className="relative w-full max-w-[600px] max-lg:hidden">
            <div className="bg-slate-400 relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
                <Image
                    src={search}
                    alt="search"
                    height={24}
                    width={24}
                    className="cursor-pointer"
                />
                <Input
                    type="text"
                    placeholder="Search globally"
                    value={query}
                    onChange={handleSearch}
                    className="text-[16px] font-normal leading-[22.4px] focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 !important; placeholder text-black border-none shadow-none outline-none bg-slate-400"
                />
            </div>
            {results.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white shadow-lg rounded-xl">
                    <ul>
                        {results.map((driver) => (
                            <li key={driver.name} className="p-2 border-b border-gray-200">
                                <div className="font-bold">{driver.name}</div>
                                <div>{driver.phone_number}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Searchbar;