'use client';
import React, { useState, useEffect } from 'react';
import { getAllDrivers, isDriverAvailable } from '@/lib/actions/driver.action';

import { assignDriverToVehicle } from '@/lib/actions/driverAndvehicle.action';
import { Button } from '@/components/ui/button';
import { getAllVehicles } from '@/lib/actions/vehicle.action';

interface Vehicle {
    _id: string;
    brand: string;
    model_name: string;
    licensePlate: string;
    fuel?: string;
    available?: boolean;
    transmission?: string;
}

interface Driver {
    _id: string;
    name: string;
    phone_number: number;
}

const AdminPage: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
    const [vehicleDetails, setVehicleDetails] = useState<Vehicle | null>(null);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [showDrivers, setShowDrivers] = useState<boolean>(false);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);

    useEffect(() => {
        getAllVehicles()
            .then((data: any) => {
                const plainVehicles = data.map((vehicle: any) => ({
                    _id: vehicle._id.toString(),
                    brand: vehicle.brand,
                    model_name: vehicle.model_name,
                    licensePlate: vehicle.licensePlate,
                    fuel: vehicle.fuel,
                    available: vehicle.available,
                    transmission: vehicle.transmission,
                }));
                setVehicles(plainVehicles);
            })
            .catch((error: any) => {
                console.error('Error fetching vehicles:', error);
            });
    }, []);


    useEffect(() => {
        getAllDrivers()
            .then((data: string) => {
                let parsedData = JSON.parse(data);

                // Ensure parsedData is an array
                if (!Array.isArray(parsedData)) {
                    parsedData = [parsedData];
                }

                const plainDrivers = parsedData.map((driver: any) => ({
                    _id: driver._id.toString(),
                    name: driver.name,
                    phone_number: driver.phone_number,
                }));
                setDrivers(plainDrivers)
            })
            .catch((error: any) => {
                console.error("Error fetching drivers:", error);
            });
    }, []);


    const handleVehicleSelect = (vehicleId: string) => {
        setSelectedVehicle(vehicleId);
        const vehicleDetails = vehicles.find(vehicle => vehicle._id === vehicleId);
        if (vehicleDetails) {
            setVehicleDetails(vehicleDetails);
        }
    };


    const handleDriverAssign = async (driverId: string) => {
        try {
            if (!startTime || !endTime) {
                alert('Please select both start and end times');
                return;
            }

            const isAvailable = await isDriverAvailable(driverId, startTime, endTime);
            if (!isAvailable) {
                alert('Driver is not available for the selected time slot');
                return;
            }

            const response = await assignDriverToVehicle({ vehicleId: selectedVehicle, driverId, startTime, endTime });

            if (response) {
                alert('Driver assigned successfully');
                setShowDrivers(false);
            } else {
                alert('Error assigning driver');
            }
        } catch (error) {
            console.error("Error in handleDriverAssign:", error);
            alert('Error assigning driver');
        }
    };

    return (
        <div>
            <h1 className=' text-2xl font-semibold'>Vehicle To Driver</h1>
            <div className='flex'>
                <div className='w-[250px] h-auto p-4 border  rounded-md mt-4'>
                    <h2 className='font-bold font-xl'>Select a Vehicle</h2>
                    {vehicles.map(vehicle => (
                        <>
                            <div key={vehicle._id} onClick={() => handleVehicleSelect(vehicle._id)} className='p-4 flex justify-center items-center hover:bg-[#eeeee5]'>
                                <h3>{vehicle.model_name}</h3>
                            </div>
                            <hr />
                        </>
                    ))}
                </div>
                <div className=' ml-8 w-[250px]'>

                    <h2 className='text-xl font-semibold'>Vehicle Details</h2>
                    {vehicleDetails && (
                        <div className='w-full border rounded-md p-6 mt-4'>
                            <div className=' '>

                                <p>
                                    <strong>Brand:</strong> {vehicleDetails.brand}<br />
                                    <strong>Model Name:</strong> {vehicleDetails.model_name}<br />
                                    <strong>Transmission Type:</strong> {vehicleDetails.transmission}<br />
                                    <strong>Fuel Type:</strong> {vehicleDetails.fuel}<br />
                                    <strong>License Plate Number:</strong> {vehicleDetails.licensePlate}
                                </p>
                            </div>
                            <Button onClick={() => { setShowDrivers(true) }} className=' bg-lime-500 hover:bg-lime-700 text-black font-semibold mt-2'>Assign</Button>
                        </div>
                    )}
                </div>
                {showDrivers && (
                    <div className=' rounded-md border h-auto p-4 ml-8'>
                        <h2 className='text-xl font-semibold'>Select a Driver</h2>
                        <div className=' border rounded-md flex flex-col gap-4 p-1'>

                            <div className='w-full flex justify-between items-center'>
                                <label className='font-bold'>Start Time:</label>
                                <input type="datetime-local" onChange={(e) => setStartTime(new Date(e.target.value))} className=' bg-slate-100 p-1.5 ml-1 rounded-md' />
                            </div>
                            <div className=' w-full flex justify-between items-center'>
                                <label className='font-bold'>End Time:</label>
                                <input className=' bg-slate-100 p-1.5 ml-1 rounded-md' type="datetime-local" onChange={(e) => setEndTime(new Date(e.target.value))} />
                            </div>

                        </div>
                        {drivers.map(driver => (
                            <>
                                <div key={driver._id} className='p-3 flex justify-center items-center gap-8'>
                                    <p>{driver.name} - {driver.phone_number}</p>
                                    <Button onClick={() => handleDriverAssign(driver._id)} className=' bg-lime-500 text-black hover:bg-lime-700'>Assign</Button>
                                </div>
                                <hr />
                            </>
                        ))}
                    </div>
                )}

            </div>

        </div>
    );
};

export default AdminPage;
