"use client";

import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { loginEmployee } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EmployeeLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await loginEmployee({ email, password });
            localStorage.setItem('employee', JSON.stringify(res.data));
            router.push('/dashboard/employee');
        } catch (error: any) {
            console.error(error);
            const errorMessage = error.response?.data?.message || 'Invalid credentials. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <Card className="w-[350px] border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex justify-center mb-2">
                        <span className="text-4xl">👔</span>
                    </div>
                    <CardTitle className="text-gray-900 text-center text-2xl">Employee Portal</CardTitle>
                    <p className="text-sm text-center text-muted-foreground">Authorized Personnel Only</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                                <div className="flex items-center gap-2">
                                    <span>⚠️</span>
                                    <span>{error}</span>
                                </div>
                            </div>
                        )}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-900">Official Email</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="employee@dept.gov.in"
                                value={email}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                                className="border-gray-200 focus-visible:ring-gray-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-gray-900">Password</label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                    className="border-gray-200 focus-visible:ring-gray-500 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={loading}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                                >
                                    {showPassword ? "👁️" : "🙈"}
                                </button>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gray-800 hover:bg-black text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="animate-spin">⏳</span>
                                    Logging in...
                                </span>
                            ) : (
                                'Login as Employee'
                            )}
                        </Button>

                        <div className="mt-4 text-center">
                            <Link href="/login" className="text-sm text-gray-800 hover:text-gray-900 hover:underline font-medium">
                                ← Back to Main Login
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
