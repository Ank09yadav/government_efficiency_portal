"use client";

import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { loginDepartment } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await loginDepartment({ username, password });
            localStorage.setItem('department', JSON.stringify(res.data));
            router.push('/dashboard/admin');
        } catch (error: any) {
            console.error('Login error:', error);
            if (error.response?.status === 401) {
                setError('Invalid username or password');
            } else if (error.response?.status >= 500) {
                setError('Server error. Please try again later.');
            } else {
                setError('Login failed. Please check your credentials.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-orange-900">
            <Card className="w-[350px] border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-red-900 text-center text-2xl">Department Portal</CardTitle>
                    <p className="text-sm text-center text-muted-foreground">Admin Access Only</p>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded mb-4 text-sm">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="username" className="text-sm font-medium text-red-900">Username</label>
                            <Input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                                required
                                className="border-red-200 focus-visible:ring-red-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-red-900">Password</label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                    required
                                    className="border-red-200 focus-visible:ring-red-500 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? "👁️" : "🙈"}
                                </button>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-red-700 hover:bg-red-800 text-white shadow-lg shadow-red-900/20"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging in...' : 'Login as Admin'}
                        </Button>

                        <div className="mt-4 text-center">
                            <Link href="/login" className="text-sm text-gray-800 hover:text-red-800 hover:underline font-medium">
                                ← Back to User Login
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
