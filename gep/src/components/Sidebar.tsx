
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Settings, User, Newspaper, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function Sidebar({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [dashboardLink, setDashboardLink] = useState('/dashboard/user'); // Default to user
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const department = localStorage.getItem('department');
        const employee = localStorage.getItem('employee');
        if (department) setDashboardLink('/dashboard/admin');
        else if (employee) setDashboardLink('/dashboard/employee');
        else setDashboardLink('/dashboard/user');
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('department');
        localStorage.removeItem('employee');
        router.push('/login');
    };

    const sidebarItems = [
        { name: 'Dashboard', path: dashboardLink, icon: LayoutDashboard },
        { name: 'News & Schemes', path: '/news', icon: Newspaper }, // Connected New Link
        { name: 'Profile', path: '/profile', icon: User },
        { name: 'Settings', path: '/settings', icon: Settings },
    ];

    if (!mounted) {
        return <div className="min-h-screen bg-background">Loading...</div>; // Avoid hydration mismatch
    }

    return (
        <div className="flex h-screen w-full bg-background overflow-hidden relative">
            <aside className="hidden w-64 flex-col border-r bg-red-950 text-white md:flex shadow-xl">
                <div className="flex flex-col h-20 justify-center border-b border-red-800 px-6 bg-red-900/50">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">🏛️</span>
                        <div>
                            <h1 className="text-sm font-bold tracking-tight text-white uppercase leading-tight">Government<br />of India</h1>
                            <p className="text-[10px] text-yellow-500 font-serif mt-0.5">सत्यमेव जयते</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 space-y-2 p-4">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                href={item.path}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-red-600 text-white shadow-md shadow-red-900/20 translate-x-1"
                                        : "text-red-100 hover:bg-red-800 hover:text-white"
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t border-red-800 p-4 bg-red-900/30">
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full justify-start text-red-100 hover:text-white hover:bg-red-800 pl-3 gap-3"
                    >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto bg-gray-50">
                {children}
            </main>
        </div>
    );
}
