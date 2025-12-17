"use client";

import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog as UIDialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { getDepartments, getDepartmentGrievances, getCensusStats, updateGrievanceStatus, updateDepartmentMetrics, createScheme } from '@/lib/api';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';

export default function AdminDashboard() {
    const router = useRouter();
    const [grievances, setGrievances] = useState([]);
    const [resolutionNote, setResolutionNote] = useState('');
    const [selectedGrievance, setSelectedGrievance] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State for user/department
    const [department, setDepartment] = useState<any>({});
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const dep = JSON.parse(localStorage.getItem('department') || '{}');
        setDepartment(dep);
        if (!dep || !dep._id) {
            router.push('/admin/login');
        }
    }, []);

    // Stats State
    const [metrics, setMetrics] = useState<any>({
        efficiency: 0,
        filesCleared: 0,
        pendingFiles: 0
    });

    // Census Data
    const [censusData, setCensusData] = useState<any>(null);

    // Loading and Error States
    const [isLoadingGrievances, setIsLoadingGrievances] = useState(true);
    const [isLoadingCensus, setIsLoadingCensus] = useState(true);
    const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Scheme State
    const [isSchemeModalOpen, setIsSchemeModalOpen] = useState(false);
    const [newSchemeTitle, setNewSchemeTitle] = useState('');
    const [newSchemeDesc, setNewSchemeDesc] = useState('');

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

    useEffect(() => {
        if (!department._id) return;

        // Fix Persistence: Load fresh department data to ensure metrics are current
        setIsLoadingMetrics(true);
        getDepartments()
            .then(departments => {
                const currentDept = departments.find((d: any) => d._id === department._id);
                if (currentDept && currentDept.metrics) {
                    setMetrics(currentDept.metrics);
                }
            })
            .catch(err => {
                console.error('Error fetching departments:', err);
                setError('Failed to load department metrics');
            })
            .finally(() => setIsLoadingMetrics(false));

        fetchGrievances();
        fetchCensusStats();
    }, [department._id]);

    const fetchGrievances = async () => {
        if (!department._id) return;
        setIsLoadingGrievances(true);
        try {
            const data = await getDepartmentGrievances(department._id);
            setGrievances(data);
            setError(null);
        } catch (error) {
            console.error(error);
            setError('Failed to load grievances');
        } finally {
            setIsLoadingGrievances(false);
        }
    };

    const fetchCensusStats = async () => {
        setIsLoadingCensus(true);
        try {
            const data = await getCensusStats();
            setCensusData(data);
        } catch (error) {
            console.error("Error fetching census data", error);
            // Census data is optional, don't set error state
        } finally {
            setIsLoadingCensus(false);
        }
    };

    const openGrievanceModal = (grievance: any) => {
        setSelectedGrievance(grievance);
        setResolutionNote(grievance.resolutionNotes || '');
        setIsModalOpen(true);
    };

    const handleUpdateStatus = async (status: string) => {
        if (!selectedGrievance) return;
        try {
            await updateGrievanceStatus(selectedGrievance._id, status, resolutionNote);
            // Success feedback
            setResolutionNote('');
            setIsModalOpen(false);
            fetchGrievances();
            // Show success message in console for now
            console.log(`✅ Grievance marked as ${status}`);
        } catch (error) {
            console.error('Error updating status:', error);
            setError(`Failed to update grievance status`);
        }
    };

    const handleUpdateMetrics = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate metrics
        if (metrics.efficiency < 0 || metrics.efficiency > 100) {
            setError('Efficiency must be between 0 and 100%');
            return;
        }
        if (metrics.filesCleared < 0 || metrics.pendingFiles < 0) {
            setError('File counts cannot be negative');
            return;
        }

        try {
            const res = await updateDepartmentMetrics(department._id, metrics);
            // Update LocalStorage to keep session in sync, though we rely on refetch mostly
            const updatedDept = { ...department, metrics: res.data.metrics };
            localStorage.setItem('department', JSON.stringify(updatedDept));
            setError(null);
            alert('Statistics updated successfully!');
            console.log('✅ Department Statistics Updated!');
        } catch (error) {
            console.error(error);
            setError('Failed to update statistics. Please try again.');
            alert('Failed to update statistics. Check console for details.');
        }
    };

    const handleCreateScheme = async () => {
        if (!newSchemeTitle || !newSchemeDesc) return;
        try {
            await createScheme({
                title: newSchemeTitle,
                description: newSchemeDesc,
                departmentId: department._id
            });
            alert('Scheme Created Successfully!');
            setIsSchemeModalOpen(false);
            setNewSchemeTitle('');
            setNewSchemeDesc('');
        } catch (error) {
            console.error(error);
            alert('Failed to create scheme.');
        }
    };

    if (!mounted) return null;
    if (!department._id) return null;

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-blue-900">Department Panel: {department.name}</h1>
                <div className="flex gap-2">
                    <Button className="bg-green-600 hover:bg-green-700" onClick={() => setIsSchemeModalOpen(true)}>
                        + Create New Scheme
                    </Button>
                    <Button variant="destructive" onClick={() => {
                        localStorage.removeItem('department');
                        router.push('/admin/login');
                    }}>Logout</Button>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                    <button
                        className="absolute top-0 bottom-0 right-0 px-4 py-3"
                        onClick={() => setError(null)}
                    >
                        <span className="text-red-500 text-xl">×</span>
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Metrics Section */}
                <Card className="border-t-4 border-t-blue-600 shadow-md">
                    <CardHeader>
                        <CardTitle className="text-blue-800">Update Statistics (Pre-filled)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoadingMetrics ? (
                            <p className="text-gray-800 text-center py-8">Loading metrics...</p>
                        ) : (
                            <form onSubmit={handleUpdateMetrics} className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Efficiency (%)</label>
                                        <Input
                                            type="number"
                                            value={metrics.efficiency || 0}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setMetrics({ ...metrics, efficiency: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Files Cleared</label>
                                        <Input
                                            type="number"
                                            value={metrics.filesCleared || 0}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setMetrics({ ...metrics, filesCleared: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Pending Files</label>
                                        <Input
                                            type="number"
                                            value={metrics.pendingFiles || 0}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setMetrics({ ...metrics, pendingFiles: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">Update Live Stats</Button>
                            </form>
                        )}
                    </CardContent>
                </Card>

                {/* Demographic Overview Snippet */}
                <Card className="border-t-4 border-t-purple-600 shadow-md">
                    <CardHeader>
                        <CardTitle className="text-purple-800">Demographic Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="block">
                        {isLoadingCensus ? (
                            <div className="h-[200px] flex items-center justify-center">
                                <p className="text-gray-800">Loading census data...</p>
                            </div>
                        ) : censusData && censusData.genderDistribution ? (
                            <div className="w-full h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={censusData.genderDistribution}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={60}
                                            fill="#8884d8"
                                            dataKey="count"
                                            nameKey="_id"
                                            label={(props: any) => props._id}
                                        >
                                            {censusData.genderDistribution.map((_entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[200px] flex items-center justify-center">
                                <p className="text-gray-800">Loading Census Data...</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Extended Analytics (If data exists) */}
            {censusData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="shadow-md">
                        <CardHeader><CardTitle>Occupation Dist.</CardTitle></CardHeader>
                        <CardContent className="h-[200px]">
                            {censusData.occupationDistribution && censusData.occupationDistribution.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={censusData.occupationDistribution}>
                                        <XAxis dataKey="_id" tick={{ fontSize: 10 }} />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#82ca9d" />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-gray-800 flex items-center justify-center h-full">No occupation data available</p>
                            )}
                        </CardContent>
                    </Card>
                    <Card className="shadow-md">
                        <CardHeader><CardTitle>Employment</CardTitle></CardHeader>
                        <CardContent className="h-[200px]">
                            {censusData.employmentDistribution && censusData.employmentDistribution.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={censusData.employmentDistribution} layout="vertical">
                                        <XAxis type="number" />
                                        <YAxis dataKey="_id" type="category" tick={{ fontSize: 10 }} width={100} />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-gray-800 flex items-center justify-center h-full">No employment data available</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Grievances List */}
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-blue-800">Received Grievances</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        {isLoadingGrievances ? (
                            <p className="text-gray-800 text-center py-8">Loading grievances...</p>
                        ) : grievances.length === 0 ? (
                            <p className="text-gray-800 text-center py-8">No grievances found.</p>
                        ) : (
                            grievances.map((g: any) => (
                                <div
                                    key={g._id}
                                    className="border p-4 rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-white group"
                                    onClick={() => openGrievanceModal(g)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-lg text-blue-900 group-hover:text-blue-700">{g.title}</h4>
                                            <p className="text-sm text-gray-800 line-clamp-1">{g.description}</p>
                                            <p className="text-xs text-gray-700 mt-2">
                                                From: <span className="font-medium">{g.raisedBy?.name || 'Anonymous'}</span> • {new Date(g.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${g.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                                                g.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {g.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Grievance Detail Modal */}
            <UIDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader className="bg-blue-50 p-6 border-b border-blue-100 -mx-6 -mt-6 rounded-t-lg">
                        <DialogTitle className="text-xl font-bold text-blue-900">{selectedGrievance?.title}</DialogTitle>
                        <DialogDescription className="text-blue-700 mt-1">
                            Grievance ID: {selectedGrievance?._id}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 max-h-[70vh] overflow-y-auto py-4">
                        {/* Citizen Info Section */}
                        <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg border">
                            <div>
                                <p className="text-sm font-medium text-gray-700">Raised By</p>
                                <p className="font-semibold text-gray-900">{selectedGrievance?.raisedBy?.name || 'Anonymous'}</p>
                                <p className="text-xs text-gray-700">{selectedGrievance?.raisedBy?.email}</p>
                            </div>
                            {selectedGrievance?.raisedBy && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        if (selectedGrievance.raisedBy && selectedGrievance.raisedBy._id) {
                                            router.push(`/admin/citizen/${selectedGrievance.raisedBy._id}`);
                                        } else {
                                            alert("Citizen profile not available (User may be deleted or ID missing)");
                                        }
                                    }}
                                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                >
                                    View Citizen Profile
                                </Button>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Description</label>
                            <div className="bg-gray-100 p-4 rounded-md border text-gray-800 text-sm leading-relaxed">
                                {selectedGrievance?.description}
                            </div>
                        </div>

                        {/* NEW: Display Address To if exists */}
                        {selectedGrievance?.addressedTo && (
                            <div className="bg-yellow-50 p-2 rounded border border-yellow-200 text-xs text-yellow-800">
                                <strong>Addressed to Official ID:</strong> {selectedGrievance.addressedTo}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Resolution Notes</label>
                            <Textarea
                                placeholder="Enter detailed resolution steps or rejection reason..."
                                value={resolutionNote}
                                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setResolutionNote(e.target.value)}
                                rows={5}
                                className="border-gray-300 focus:border-blue-500 min-h-[100px]"
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-3">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={() => handleUpdateStatus('Rejected')}>Reject Grievance</Button>
                        <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleUpdateStatus('Resolved')}>Answer & Resolve</Button>
                    </DialogFooter>
                </DialogContent>
            </UIDialog>

            {/* Scheme Creation Modal */}
            <UIDialog open={isSchemeModalOpen} onOpenChange={setIsSchemeModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Scheme</DialogTitle>
                        <DialogDescription>Announce a new government scheme or update.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Scheme Title</label>
                            <Input value={newSchemeTitle} onChange={(e) => setNewSchemeTitle(e.target.value)} placeholder="e.g. Digital India Initiative" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <Textarea value={newSchemeDesc} onChange={(e) => setNewSchemeDesc(e.target.value)} placeholder="Details about the scheme..." />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsSchemeModalOpen(false)}>Cancel</Button>
                        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCreateScheme}>Publish Scheme</Button>
                    </DialogFooter>
                </DialogContent>
            </UIDialog>
        </div>
    );
}
