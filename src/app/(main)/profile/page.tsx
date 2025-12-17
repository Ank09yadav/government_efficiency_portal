"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User as UserIcon, Mail, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Profile() {
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const department = JSON.parse(localStorage.getItem('department') || '{}');
        const employee = JSON.parse(localStorage.getItem('employee') || '{}');

        // Determine which profile to show
        const profileData = user._id ? { ...user, type: 'Citizen' } :
            (department._id ? { ...department, type: 'Department Admin', email: department.username } :
                (employee._id ? { ...employee, type: 'Official / Employee', role: employee.role } : null));

        setProfile(profileData);
        setLoading(false);
    }, []);

    if (loading) return null;

    if (!profile) {
        return <div className="p-6">Please log in to view profile.</div>;
    }

    return (
        <div className="space-y-6 p-6">
            <h2 className="text-3xl font-bold tracking-tight text-blue-900">Your Profile</h2>

            <Card className="max-w-md shadow-lg border-t-4 border-t-blue-600">
                <CardHeader className="flex flex-col items-center">
                    <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center mb-4 border-2 border-blue-200">
                        <UserIcon className="h-10 w-10 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl text-blue-900">{profile.name}</CardTitle>
                    <p className="text-gray-700 font-medium">{profile.type}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-gray-100 rounded-lg border border-gray-100">
                        <Mail className="h-5 w-5 text-blue-500" />
                        <div>
                            <p className="text-sm font-medium text-gray-700">Email / Username</p>
                            <p className="text-sm text-gray-900">{profile.email || profile.username}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-gray-100 rounded-lg border border-gray-100">
                        <Shield className="h-5 w-5 text-blue-500" />
                        <div>
                            <p className="text-sm font-medium text-gray-700">Role</p>
                            <p className="text-sm text-gray-900 capitalize">{profile.role || 'Administrator'}</p>
                        </div>
                    </div>

                    <Button className="w-full mt-4 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-red-200" variant="outline" onClick={() => {
                        localStorage.removeItem('user');
                        localStorage.removeItem('department');
                        localStorage.removeItem('employee');
                        router.push('/login');
                    }}>
                        Sign Out
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
