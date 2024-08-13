'use client';
import React, { useState, useEffect } from 'react';
import { getDriverAssignmentRequests, acceptAssignmentRequest, rejectAssignmentRequest } from '@/lib/actions/driverRequest';
import { UserDetails } from '@/types';

export interface Vehicle {
    _id: string;
    model_name: string;
    brand: string;
    licensePlate: string;
    fuel: string;
    transmission: string;
}

interface IAssignment {
    vehicle: {
        model_name: string;
    };
    start_time: string;
    end_time: string;
}

interface AssignmentRequest extends IAssignment {
    _id: string;
}
const Page: React.FC = () => {
    const [requests, setRequests] = useState<AssignmentRequest[]>([]);

    const [userdetails, setUserdetails] = React.useState<UserDetails>({
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
            // console.log(user)
        }
    }, []);

    useEffect(() => {
        async function getRequests() {
            const res = await getDriverAssignmentRequests(userdetails.email);
            console.log(res);
        }
        getRequests();
    }, [userdetails]);

    const handleAccept = async (requestId: string) => {
        try {
            await acceptAssignmentRequest(requestId);
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
            <h1>Assignment Requests</h1>
            {requests.length === 0 ? (
                <p>No assignment requests</p>
            ) : (
                requests.map(request => (
                    <div key={request._id} className='request'>
                        <p>Vehicle: {request.vehicle.model_name}</p>
                        <p>Start Time: {new Date(request.start_time).toLocaleString()}</p>
                        <p>End Time: {new Date(request.end_time).toLocaleString()}</p>
                        <button onClick={() => handleAccept(request._id)}>Accept</button>
                        <button onClick={() => handleReject(request._id)}>Reject</button>
                    </div>
                ))
            )}
        </div>
    );
};


export default Page;