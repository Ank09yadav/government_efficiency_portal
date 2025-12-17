"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, Calendar, ArrowLeft } from 'lucide-react';
import { getUserDetails, getUserGrievances } from '@/lib/api';

export default function CitizenProfile() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();
    const [citizen, setCitizen] = useState<any>(null);
    const [grievances, setGrievances] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchCitizenData();
        }
    }, [id]);

    const fetchCitizenData = async () => {
        try {
            // 1. Get User Details
            const userData = await getUserDetails(id);
            setCitizen(userData);

            // 2. Get User's Grievances
            const grievanceData = await getUserGrievances(id);
            setGrievances(grievanceData);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Citizen Profile...</div>;
    if (!citizen) return <div className="p-10 text-center text-red-500">Citizen not found</div>;

    return (
        <div className="container mx-auto p-6 space-y-6">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>

            {/* Profile Header */}
            <Card className="bg-blue-900 border-none text-white shadow-xl">
                <CardHeader className="flex flex-row items-center gap-6">
                    <div className="h-20 w-20 rounded-full bg-white/10 flex items-center justify-center">
                        <User className="h-10 w-10 text-blue-100" />
                    </div>
                    <div>
                        <CardTitle className="text-3xl font-bold">{citizen.name}</CardTitle>
                        <div className="flex items-center gap-4 mt-2 text-blue-200">
                            <div className="flex items-center gap-1">
                                <Mail className="h-4 w-4" /> {citizen.email}
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" /> ID: {citizen._id}
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Grievance History */}
            <h3 className="text-xl font-bold text-gray-800">Grievance History</h3>
            <div className="grid gap-4">
                {grievances.length === 0 ? (
                    <p className="text-gray-700 italic">No grievances raised by this citizen.</p>
                ) : (
                    grievances.map((g: any) => (
                        <Card key={g._id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between">
                                    <h4 className="font-semibold text-lg text-blue-900">{g.title}</h4>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${g.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                                        g.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {g.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-800">{new Date(g.createdAt).toLocaleDateString()} • To: {g.department?.name || 'Department'}</p>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-900">{g.description}</p>
                                {g.resolutionNotes && (
                                    <div className="mt-3 bg-gray-100 p-3 rounded text-sm border-l-4 border-blue-500">
                                        <strong>Admin Response:</strong> {g.resolutionNotes}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
