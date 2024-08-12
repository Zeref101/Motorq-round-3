'use client';
import Image from 'next/image';
import React, { useEffect } from 'react';
// import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
// import { redirect } from 'next/navigation';
// import { Button } from '@/components/ui/button';
import default_profile from "/public/images/defaultPFP.jpeg"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { getDriverByEmail, updateDriverByEmail } from '@/lib/actions/driver.action';

const formSchema = z.object({
    name: z.string().min(2).max(50),
    phone_number: z.number().optional(),
    location: z.string().optional(),
});

interface UserDetails {
    name: string;
    phone_number: number;
    email: string;
    location?: string;
}

const Page = () => {

    const [userdetails, setUserdetails] = React.useState<UserDetails | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const user = JSON.parse(localStorage.getItem("user") || 'null') as UserDetails | null;
            setUserdetails(user);
            console.log(user)
        }
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: userdetails?.name || '',
            phone_number: userdetails?.phone_number || 0,
            location: userdetails?.location || ''

        },
    })


    async function onSubmit(values: z.infer<typeof formSchema>) {

        const updates = {
            name: values.name,
            phone_number: values.phone_number,
            location: values.location,
        };

        try {
            if (userdetails?.email) {
                console.log(userdetails.email)
                const plainUpdates = JSON.parse(JSON.stringify(updates));
                const res = await updateDriverByEmail(userdetails.email, plainUpdates);
                console.log('Profile updated successfully:', res);
            }
            form.reset();
        } catch (error) {
            console.log(error);
            throw error;
        }


    }
    return (
        <div className=' w-full'>
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
                    <Button type="submit" className=' w-[12rem]'>Submit</Button>
                </form>
            </Form>
        </div>
    );
};

export default Page;