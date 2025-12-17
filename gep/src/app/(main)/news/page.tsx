"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Building } from 'lucide-react';
import { getSchemes } from '@/lib/api';

export default function News() {
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSchemes();
    }, []);

    const fetchSchemes = async () => {
        try {
            const data = await getSchemes();
            setSchemes(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setError('Failed to load schemes.');
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Government Schemes & News</h1>
            <p className="text-muted-foreground">Stay updated with the latest announcements from various departments.</p>

            {loading ? (
                <div className="text-center py-10">Loading News...</div>
            ) : error ? (
                <div className="text-center py-10 text-red-600">{error}</div>
            ) : schemes.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No active schemes or news at the moment.</div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {schemes.map((scheme: any) => (
                        <Card key={scheme._id} className="hover:shadow-lg transition-shadow border-t-4 border-t-blue-600">
                            <CardHeader>
                                <div className="mb-2">
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                                        <Building className="w-3 h-3 mr-1" />
                                        {scheme.department?.name || 'Government'}
                                    </Badge>
                                </div>
                                <CardTitle className="text-xl line-clamp-2">{scheme.title}</CardTitle>
                                <CardDescription className="flex items-center gap-1 mt-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(scheme.createdAt).toLocaleDateString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 whitespace-pre-line">{scheme.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
