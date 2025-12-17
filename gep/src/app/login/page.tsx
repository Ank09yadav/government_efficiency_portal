
"use client";

import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { loginUser } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
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
            const res = await loginUser({ email, password });
            localStorage.setItem('user', JSON.stringify(res.data));
            router.push('/dashboard/user');
        } catch (error: any) {
            console.error(error);
            const errorMessage = error.response?.data?.message || 'Invalid credentials. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-orange-900">
            <Card className="w-[400px] shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-red-100/50 rounded-full flex items-center justify-center">
                            <span className="text-3xl">🏛️</span>
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-center font-bold text-red-700">Gov-Productivity</CardTitle>
                    <p className="text-sm text-center text-muted-foreground">Secure Access Portal</p>
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
                            <label htmlFor="email" className="text-sm font-medium text-red-900">Email</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                                className="border-red-200 focus-visible:ring-red-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-red-900">Password</label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                    className="border-red-200 focus-visible:ring-red-500 pr-10"
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
                            className="w-full bg-red-800 hover:bg-red-900 text-white shadow-lg shadow-red-950/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="animate-spin">⏳</span>
                                    Logging in...
                                </span>
                            ) : (
                                'Login'
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col justify-center space-y-3 bg-muted/20 pb-6 pt-2">
                    <p className="text-xs text-gray-800 hover:text-red-700 font-medium transition-colors">Don't have an account? <Link href="/signup" className="text-red-600 font-semibold hover:underline">Sign up</Link></p>
                    <Link href="/employee/login" className="text-xs text-gray-800 hover:text-red-700 font-medium transition-colors">Login as Official/Employee</Link>
                    <Link href="/admin/login" className="text-xs text-gray-800 hover:text-red-700 font-medium transition-colors">Login as Department Admin</Link>
                </CardFooter>
            </Card>
        </div >
    );
}
