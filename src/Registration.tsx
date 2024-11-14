import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { useForm, SubmitHandler } from "react-hook-form"
import { Button } from './components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from './components/ui/form';
import { Input } from './components/ui/input';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { userRegSchema } from './util/types';

import supabase from './supabaseClient';

export const Registration: React.FC = () => {

    const form = useForm<z.infer<typeof userRegSchema>>({
        resolver: zodResolver(userRegSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
    });

    async function onSubmit(data: z.infer<typeof userRegSchema>) {
        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        username: data.username,
                    },
                },
            });

            console.log(authData);
            if (authError) throw authError;

        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Register</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="Username" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="Password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="Email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button type="submit">Register</Button>
                    </form>
                </Form>
            </CardContent>
        </Card >
    );
};
