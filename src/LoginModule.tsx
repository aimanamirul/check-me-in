import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Session } from '@supabase/supabase-js';
import { Toaster } from "@/components/ui/toaster"
import { useToast } from '@/hooks/use-toast'
import { Spinner } from '@/components/spinner';
import supabase from './supabaseClient';

interface LoginModuleProps {
  onLogin: (session: Session | null) => void;
}

export const LoginModule: React.FC<LoginModuleProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      onLogin(session);
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      onLogin(session);
    })

    return () => subscription.unsubscribe()
  }, [onLogin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Use Supabase client to validate credentials
    const { data: { session }, error } = await supabase.auth.signInWithPassword({
      email: username,
      password: password,
    });

    if (error) {
      console.error('Error logging in:', error.message);
      setIsLoading(false);
      toast({
        title: 'Login Failed',
        description: error.message,
      });
      return;
    }

    onLogin(session);
    setIsLoading(false);
  };

  return (
    <Card className="relative w-full">
      <CardHeader>
        <CardTitle>Please login to save your check-ins.</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Input
                id="username"
                placeholder="Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </form>

        {session && (
          <div className="text-center mt-4">
            <p>This app is powered by Supabase.</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex">
        <Toaster />
        <Button className="mx-1" onClick={handleLogin}>Login</Button>
        <Button variant="outline" className="mx-1" onClick={() => alert("Password reset functionality coming soon!")}>Forgot Password?</Button>
      </CardFooter>
      {isLoading && <Spinner text="Logging in..." />}
    </Card>
  );
};
