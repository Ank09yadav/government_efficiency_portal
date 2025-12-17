"use client";

import { useState, useEffect } from 'react';
import { getEmployeeGrievances, updateGrievanceStatus } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, User, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EmployeeDashboard() {
    const [employee, setEmployee] = useState<any>(null);
    const [grievances, setGrievances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [resolutionNotes, setResolutionNotes] = useState<{ [key: string]: string }>({});
    const router = useRouter();

    useEffect(() => {
        const empData = JSON.parse(localStorage.getItem('employee') || '{}');
        if (empData && empData._id) {
            setEmployee(empData);
            fetchGrievances(empData._id);
        } else {
            router.push('/employee/login');
        }
    }, []);

    const fetchGrievances = async (empId: string) => {
        try {
            const data = await getEmployeeGrievances(empId);
            setGrievances(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleAction = async (id: string, action: 'Resolved' | 'Rejected' | 'Pass', notes?: string) => {
        const note = notes || resolutionNotes[id] || (action === 'Pass' ? 'Passed to Admin' : '');

        if (!note && action !== 'Pass') {
            alert('Please add a note before resolving/rejecting.');
            return;
        }

        try {
            let status = 'Pending'; // Default
            if (action === 'Resolved') status = 'Resolved';
            if (action === 'Rejected') status = 'Rejected';

            await updateGrievanceStatus(id, status, note);

            alert(`Action Taken: ${action}`);
            if (employee) fetchGrievances(employee._id);
        } catch (error) {
            console.error(error);
            alert('Error updating grievance');
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Dashboard...</div>;

    return (
        <div className="container mx-auto p-6 space-y-6">
            <header className="flex justify-between items-center bg-white p-6 rounded-lg shadow-md border-l-4 border-gray-800">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Employee Dashboard</h1>
                    <p className="text-gray-700">Welcome, {employee?.name} | {employee?.department?.name}</p>
                </div>
                <Button variant="outline" onClick={() => {
                    localStorage.removeItem('employee');
                    router.push('/employee/login');
                }}>Logout</Button>
            </header>

            <h2 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare className="h-5 w-5" /> Messages from Citizens
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {grievances.length === 0 ? (
                    <p className="text-gray-800 italic">No pending tasks assigned.</p>
                ) : (
                    grievances.map((g: any) => (
                        <Card key={g._id} className="flex flex-col h-full hover:shadow-xl transition-shadow border-t-4 border-t-blue-500">
                            <CardHeader className="bg-gray-100">
                                <CardTitle className="text-lg text-blue-900 line-clamp-1">{g.title}</CardTitle>
                                <div className="flex items-center gap-2 text-xs text-gray-700 mt-1">
                                    <User className="h-3 w-3" />
                                    {g.raisedBy?.name || 'Anonymous'}
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 py-4 space-y-4">
                                <p className="text-sm text-gray-900 bg-white p-3 rounded border h-24 overflow-y-auto">
                                    {g.description}
                                </p>
                                <Textarea
                                    placeholder="Enter response or remarks..."
                                    className="resize-none text-xs"
                                    value={resolutionNotes[g._id] || ''}
                                    onChange={(e) => setResolutionNotes({ ...resolutionNotes, [g._id]: e.target.value })}
                                />
                            </CardContent>
                            <CardFooter className="flex flex-col gap-2 bg-gray-100 p-3 pt-0">
                                <Button
                                    className="w-full bg-green-600 hover:bg-green-700 h-8 text-xs"
                                    onClick={() => handleAction(g._id, 'Resolved')}
                                >
                                    <CheckCircle className="mr-2 h-3 w-3" /> Address Anonymously
                                </Button>
                                <div className="flex gap-2 w-full">
                                    <Button
                                        variant="outline"
                                        className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50 h-8 text-xs"
                                        onClick={() => handleAction(g._id, 'Pass')}
                                    >
                                        <ArrowRight className="mr-2 h-3 w-3" /> Pass to Admin
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="flex-1 h-8 text-xs"
                                        onClick={() => handleAction(g._id, 'Rejected')}
                                    >
                                        <XCircle className="mr-2 h-3 w-3" /> Reject
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
