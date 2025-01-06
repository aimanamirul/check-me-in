import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useForm } from "react-hook-form"
import { Button } from '../../components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Spinner } from '../../components/spinner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { userRegSchema } from '../../util/types';

import supabase from '../../util/supabaseClient';

interface RegistrationProps {
    onRegistrationSuccess: () => void;
}

export const Registration: React.FC<RegistrationProps> = ({ onRegistrationSuccess }) => {
    const form = useForm<z.infer<typeof userRegSchema>>({
        resolver: zodResolver(userRegSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
    });

    const { setError } = form;

    const [isLoading, setIsLoading] = useState(false);

    async function onSubmit(data: z.infer<typeof userRegSchema>) {
        try {
            setIsLoading(true);
            const { error: authError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        username: data.username,
                    },
                },
            });

            if (authError) {
                if (authError.message.includes('already registered')) {
                    setError('root', { 
                        message: 'Email already registered. Please use a different email address or try logging in.'
                    });
                } else {
                    setError('root', { 
                        message: authError.message 
                    });
                }
                return;
            }

            onRegistrationSuccess();

        } catch (error: any) {
            setError('root', { 
                message: error.message || 'Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="relative w-full">
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
                                            <Input placeholder="Display Name" {...field} />
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
                                            <Input type="password" placeholder="Password" {...field} />
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
                        <FormMessage className="text-red-500">
                            {form.formState.errors.root?.message}
                        </FormMessage>
                        <Button type="submit">Register</Button>
                    </form>
                </Form>
            </CardContent>
            {isLoading && <Spinner text="Registering..." />}
        </Card>
    );
};
