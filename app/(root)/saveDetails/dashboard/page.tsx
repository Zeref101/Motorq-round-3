'use client';
import Image from 'next/image';
import React, { useEffect } from 'react';
import default_profile from "/public/images/defaultPFP.jpeg"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { Button } from "@/components/ui/button"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { AllDrivers, getDriverByEmail, updateDriverByEmail } from '@/lib/actions/driver.action';

const formSchema = z.object({
    name: z.string().max(50).optional(),
    phone_number: z.number().optional(),
    location: z.string().optional(),
    working_hours: z.array(z.object({
        day: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]),
        start: z.date(),
        end: z.date(),
    })).optional(),
});

type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
interface WorkingHour {
    day?: DayOfWeek;
    start?: Date;
    end?: Date;
}
interface UserDetails {
    name: string;
    phone_number: number;
    location: string;
    email: string;
    working_hours?: WorkingHour[];
}
const Page = () => {

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
            console.log(user)
        }
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: userdetails?.name,
            phone_number: userdetails?.phone_number,
            location: userdetails?.location,
            working_hours: userdetails?.working_hours,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "working_hours"
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const data = JSON.parse(JSON.stringify(values.working_hours));

        const updates = {
            name: values.name,
            phone_number: values.phone_number,
            location: values.location,
            working_hours: data,
        };

        try {
            if (userdetails?.email) {
                console.log(userdetails.email)
                const plainUpdates = JSON.parse(JSON.stringify(updates));
                const res = await updateDriverByEmail(userdetails.email, plainUpdates);
                console.log(res);
            }
            form.reset();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    return (
        <div className=' w-full '>
            <div className=' flex flex-col gap-4 justify-center items-center'>
                <Image src={default_profile} alt='pfp' width={100} height={100} className='rounded-md' />
                <span className='text-[30px] font-regular leading-[31.2px]'>Hello👋, Shreyas</span>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your full name" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone_number"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input
                                        type='number'
                                        placeholder="Enter your phone number"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                </FormControl>
                                <FormDescription>
                                    This is your phone number
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your location" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your location.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className=' flex flex-col gap-8'>
                        <FormLabel>Working Hours</FormLabel>
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex space-x-4">
                                <FormField
                                    control={form.control}
                                    name={`working_hours.${index}.day`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input placeholder="Day" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`working_hours.${index}.start`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    type="datetime-local"
                                                    placeholder="Start Time"
                                                    {...field}
                                                    value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''}
                                                    onChange={(e) => field.onChange(new Date(e.target.value))}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`working_hours.${index}.end`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    type="datetime-local"
                                                    placeholder="End Time"
                                                    {...field}
                                                    value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''}
                                                    onChange={(e) => field.onChange(new Date(e.target.value))}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button type="button" onClick={() => remove(index)}>Remove</Button>
                            </div>
                        ))}
                        <div className='mt-8'>
                        </div>
                        <Button type="button" onClick={() => append({ day: "Monday", start: new Date(), end: new Date() })}>Add Working Hour</Button>
                    </div>
                    <Button type="submit" className=' w-[12rem]'>Submit</Button>
                </form>
            </Form>
        </div>
    );
}

export default Page;