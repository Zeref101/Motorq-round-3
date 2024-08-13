'use client';
import React, { useState, useEffect } from 'react';
import { getDriverAssignmentRequests, acceptAssignmentRequest, rejectAssignmentRequest } from '@/lib/actions/driverRequest';

import { UserDetails } from '@/types';
import { Button } from '@/components/ui/button';
import { ObjectId } from 'mongoose';
import { advSearchDrivers } from '@/lib/actions/driver.action';

export interface Vehicle {
    _id: string;
    brand: string;
    model_name: string;
    licensePlate: string;
    fuel: string;
    available: boolean;
    transmission: string;
    __v: number;
}


interface IAssignment {
    vehicle: Vehicle;
    start_time: string;
    end_time: string;
    status: string;
}

interface AssignmentRequest extends IAssignment {
    _id: string;
}

interface DriverDetails {
    _id: ObjectId;
    name: string;
    email: string;
    phone_number: number;
    assignment_requests: AssignmentRequest[];
    working_hours: string[];
    assignments: any[]; // Define the structure of assignments if known
    __v: number;
    location: string;
}

const Page: React.FC = () => {
    const [requests, setRequests] = useState<AssignmentRequest[]>([]);
    const [userdetails, setUserdetails] = useState<UserDetails>({
        name: '',
        phone_number: 0,
        location: '',
        email: '',
        working_hours: [],
    });
    const [location, setLocation] = useState('');
    const [drivers, setDrivers] = useState<DriverDetails[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const user = JSON.parse(localStorage.getItem("user") || '{}') as UserDetails;
            setUserdetails(user);
        }
    }, []);

    // useEffect(() => {
    //     async function getRequests() {
    //         const res = await getDriverAssignmentRequests(userdetails.email);
    //         if (res !== false) {
    //             const parsedRequests = JSON.parse(res).map((request: any) => ({
    //                 _id: request._id,
    //                 vehicle: {
    //                     model_name: request.vehicle.model_name,
    //                 },
    //                 start_time: request.start_time,
    //                 end_time: request.end_time,
    //             }));
    //             setRequests(parsedRequests);
    //         } else {
    //             console.log("false");
    //         }
    //     }
    //     getRequests();
    // }, [userdetails]);

    const handleAccept = async (vehicleId: string, startTime: string, endTime: string) => {
        try {
            const params = {
                driverEmail: userdetails.email,
                vehicleId,
                startTime,
                endTime
            };
            await acceptAssignmentRequest(params);
            setRequests(prevRequests => prevRequests.filter(request => request._id !== vehicleId));
        } catch (error) {
            console.error('Failed to accept assignment request:', error);
        }
    };

    const handleReject = async (requestId: string) => {
        try {
            await rejectAssignmentRequest(requestId);
            setRequests(prevRequests => prevRequests.filter(request => request._id !== requestId));
        } catch (error) {
            console.error('Failed to reject assignment request:', error);
        }
    };

    const handleSearch = async () => {
        if (location.trim() === '') {
            console.error('Location cannot be empty');
            return;
        }
        const result = await advSearchDrivers(location);
        setDrivers(JSON.parse(result));
    };
    return (
        <div>
            <h1 className='text-[25px] font-bold'>Assignment Requests</h1>
            {requests.length === 0 ? (
                <p>No assignment requests</p>
            ) : (
                requests.map(request => (
                    <div key={request._id} className='request border w-fit p-4 rounded-md'>
                        <p className='font-bold'>Vehicle: {request.vehicle.model_name}</p>
                        <p>Start Time: {new Date(request.start_time).toLocaleString()}</p>
                        <p>End Time: {new Date(request.end_time).toLocaleString()}</p>
                        <div className='flex gap-4'>
                            <Button onClick={() => handleAccept(request.vehicle._id, request.start_time, request.end_time)} className='bg-lime-600 hover:bg-lime-700'>Accept</Button>
                            <Button onClick={() => handleReject(request._id)} className='bg-red-600 hover:bg-red-700'>Reject</Button>
                        </div>
                    </div>
                ))
            )}

            <h1 className='text-[25px] font-bold'>Search Drivers</h1>
            <div className='flex gap-4'>

                <input
                    type='text'
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder='Enter location'
                    className='border p-2 rounded-md'
                />
                <button onClick={handleSearch} className='bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md'>
                    Search
                </button>
            </div>
            <div className='w-[300px] mt-4 flex flex-col gap-4'>
                {drivers.length === 0 ? (
                    <p>No drivers found</p>
                ) : (
                    drivers.map((driver) => (
                        <div key={driver._id} className='driver border w-full p-4 rounded-md'>
                            <p className='font-bold'>Name: {driver.name}</p>
                            <p>Email: {driver.email}</p>
                            <p>Phone: {driver.phone_number}</p>
                            <p>Location: {driver.location}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Page;