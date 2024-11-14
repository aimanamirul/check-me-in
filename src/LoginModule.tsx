import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Session } from '@supabase/supabase-js';
import supabase from './supabaseClient';

interface LoginModuleProps {
  onLogin: () => void;
}

export const LoginModule: React.FC<LoginModuleProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Use Supabase client to validate credentials

    onLogin();
  };

  const handleRegBtn = () => {
    //change to register component
    
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Please login to save your check-ins.</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Input
                id="username"
                placeholder="Username"
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
        <Button className="mx-1" onClick={handleLogin}>Login</Button>
      </CardFooter>
    </Card>
  );
};
