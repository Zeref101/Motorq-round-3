'use client';
import { getAllUsersWithVehicleAssignments } from '@/lib/actions/driver.action';
import { unassignDriverFromVehicle } from '@/lib/actions/driverAndvehicle.action';
import React, { useState, useEffect } from 'react';
import { User, Vehicle, Assignment } from '@/types';

const Page = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        getAllUsersWithVehicleAssignments()
            .then(users => {
                const parsedUsers = JSON.parse(users);
                setUsers(parsedUsers);
                console.log('Users with vehicle assignments:', parsedUsers);
            })
            .catch(error => {
                console.error('Error fetching users with vehicle assignments:', error);
            });
    }, []);

    const handleUnassign = async (driverId: string, vehicleId: string) => {
        try {
            const res = await unassignDriverFromVehicle({ driverId, vehicleId });
            // Update the state to reflect the changes
            setUsers(prevUsers => prevUsers.map(user => {
                if (user._id === driverId) {
                    return {
                        ...user,
                        assignments: user.assignments.filter(
                            assignment => assignment.vehicle._id !== vehicleId
                        )
                    };
                }
                return user;
            }));
        } catch (error) {
            console.error('Failed to unassign driver from vehicle:', error);
        }
    };

    return (
        <>
            <h1 className='text-[30px] font-bold'>Drivers with Assignments</h1>
            <div className='flex gap-4 flex-col justify-center items-start border p-2 rounded-md'>
                {users.map((driver) => (
                    <div key={driver._id} className='flex flex-col justify-center items-start gap-4 border p-2 rounded-md'>
                        <h2 className='text-[24px] font-semibold'>Driver Information</h2>
                        <p><strong>Name:</strong> {driver.name}</p>
                        <p><strong>Phone Number:</strong> {driver.phone_number}</p>
                        <h3 className='text-[20px] font-semibold mt-4'>Assignments</h3>
                        {driver.assignments.map((assignment) => (
                            <div key={assignment._id} className='flex flex-col gap-2 border p-2 rounded-md'>
                                <p><strong>Vehicle Model:</strong> {assignment.vehicle.model_name}</p>
                                <p><strong>Vehicle Brand:</strong> {assignment.vehicle.brand}</p>
                                <p><strong>License Plate:</strong> {assignment.vehicle.licensePlate}</p>
                                <p><strong>Fuel Type:</strong> {assignment.vehicle.fuel}</p>
                                <p><strong>Transmission:</strong> {assignment.vehicle.transmission}</p>
                                <p><strong>Assignment Start Time:</strong> {new Date(assignment.start_time).toLocaleString()}</p>
                                <p><strong>Assignment End Time:</strong> {new Date(assignment.end_time).toLocaleString()}</p>
                                <button
                                    className='bg-red-500 text-white p-2 rounded-md mt-2'
                                    onClick={() => handleUnassign(driver._id, assignment.vehicle._id)}
                                >
                                    Unassign Vehicle
                                </button>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
}

export default Page;