'use client';
import React, { useState, useEffect } from 'react';
import { getDriverAssignmentRequests, acceptAssignmentRequest, rejectAssignmentRequest } from '@/lib/actions/driverRequest';
import { UserDetails } from '@/types';
import { Button } from '@/components/ui/button';
import { NEXT_CACHE_TAG_MAX_LENGTH } from 'next/dist/lib/constants';

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
    _id: string;
}

interface AssignmentRequest extends IAssignment {
    _id: string;
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

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const user = JSON.parse(localStorage.getItem("user") || '{}') as UserDetails;
            setUserdetails(user);
        }
    }, []);

    useEffect(() => {
        async function getRequests() {
            const res = await getDriverAssignmentRequests(userdetails.email);
            if (res !== false) {
                const parsedRequests = JSON.parse(res).map((request: any) => {
                    // console.log(request._id, request.vehicle._id, "oaisjdoiajdoajdoadji");
                    return {
                        _id: request.vehicle._id,
                        vehicle: {
                            model_name: request.vehicle.model_name,
                        },
                        start_time: request.start_time,
                        end_time: request.end_time,
                    };
                });
                setRequests(parsedRequests);
                console.log(parsedRequests);
            } else {
                console.log("false");
            }
        }
        getRequests();
    }, [userdetails]);

    const handleAccept = async (requestId: string, startTime: string, endTime: string) => {
        console.log(requestId, startTime, endTime, "aijfojfoajfoafjo");
        try {
            const params = {
                driverEmail: userdetails.email,
                vehicleId: requestId,
                startTime,
                endTime
            };
            await acceptAssignmentRequest(params);
            setRequests(prevRequests => prevRequests.filter(request => request._id !== requestId));
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

    return (
        <div>
            <h1 className=' text-[25px] font-bold'>Assignment Requests</h1>
            {requests.length === 0 ? (
                <p>No assignment requests</p>
            ) : (
                requests.map(request => (
                    <div key={request._id} className='request border w-fit p-4 rounded-md'>
                        <p className=' font-bold'>Vehicle: {request.vehicle.model_name}</p>
                        <p>Start Time: {new Date(request.start_time).toLocaleString()}</p>
                        <p>End Time: {new Date(request.end_time).toLocaleString()}</p>
                        <div className='flex gap-4'>
                            <Button onClick={() => handleAccept(request._id, request.start_time, request.end_time)} className=' bg-lime-600 hover:bg-lime-700'>Accept</Button>
                            <Button onClick={() => handleReject(request._id)} className=' bg-red-600 hover:bg-red-700'>Reject</Button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Page;