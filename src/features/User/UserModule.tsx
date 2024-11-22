import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import supabase from '../../util/supabaseClient';
import { User } from '../../util/types';
import { Session } from '@supabase/supabase-js';

interface SessionUser extends User {
    session: Session;
    onLogout: () => void;
}

export const UserModule: React.FC<SessionUser> = ({ session, onLogout }) => {
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error logging out:', error.message);
            return;
        }
        onLogout();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>User Menu</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="text-lg">
                    Welcome, {session.user.user_metadata.username}!
                </div>
                <Button onClick={handleLogout}>
                    Logout
                </Button>
            </CardContent>
        </Card>
    );
};
