
"use client";

import { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import MessageCard from '@/components/MessageCard';
import { getUserGrievances, getDepartments, createGrievance, reopenGrievance, getPublicEmployees } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function UserDashboard() {
    const [grievances, setGrievances] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        // Hydration check + auth check
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            router.push('/login');
            return;
        }
        setUser(JSON.parse(storedUser));
    }, []);

    useEffect(() => {
        if (!user) return;
        fetchGrievances();
        fetchDepartments();
    }, [user]);

    const fetchGrievances = async () => {
        if (!user?._id) return;
        try {
            const data = await getUserGrievances(user._id);
            setGrievances(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchDepartments = async () => {
        try {
            const data = await getDepartments();
            setDepartments(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await createGrievance({
                title,
                description,
                department: departmentId,
                raisedBy: user._id
            });
            alert('Grievance Submitted!');
            fetchGrievances(); // Refresh list
            setTitle('');
            setDescription('');
        } catch (error) {
            alert('Error submitting grievance');
        }
    };

    const [selectedDeptStats, setSelectedDeptStats] = useState<any>(null);

    const handleDeptChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const deptId = e.target.value;
        if (deptId === "POLICE_FLOW") {
            setDepartmentId("POLICE_FLOW");
            setSelectedDeptStats(null);
            return;
        }

        setDepartmentId(deptId);
        if (deptId) {
            const dept = departments.find((d: any) => d._id === deptId);
            setSelectedDeptStats(dept);
        } else {
            setSelectedDeptStats(null);
        }
    };

    if (!user) return null; // Or loading spinner

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
                <Button variant="outline" onClick={() => {
                    localStorage.removeItem('user');
                    router.push('/login');
                }}>Logout</Button>
            </div>

            {/* Department Progress Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Check Department Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium">Select Department</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            value={departmentId}
                            onChange={handleDeptChange}
                        >
                            <option value="">-- Choose Department --</option>
                            {/* Special Logic for Police */}
                            <option value="POLICE_FLOW">👮 State Police Depts</option>
                            <option disabled>----------------</option>
                            {departments.filter((d: any) => !d.name.includes('Police')).map((dept: any) => (
                                <option key={dept._id} value={dept._id}>{dept.name}</option>
                            ))}
                        </select>

                        {/* Secondary Dropdown for Police */}
                        {departmentId === "POLICE_FLOW" && (
                            <div className="mt-2 pl-4 border-l-2 border-red-200">
                                <label className="text-xs font-bold text-red-800">Select State Police Force</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-red-200 bg-red-50 px-3 py-1 text-sm shadow-sm mt-1"
                                    onChange={(e) => {
                                        const policeDeptId = e.target.value;
                                        if (policeDeptId) {
                                            const dept = departments.find((d: any) => d._id === policeDeptId);
                                            // Directly set stats without changing main dropdown value if possible, 
                                            // or better: Actually handle the state change to select this dept ID
                                            // But for UI "open another dialogue" feel, we do this:
                                            setDepartmentId(policeDeptId);
                                            setSelectedDeptStats(dept);
                                        }
                                    }}
                                >
                                    <option value="">-- Select State --</option>
                                    {departments.filter((d: any) => d.name.includes('Police')).map((dept: any) => (
                                        <option key={dept._id} value={dept._id}>{dept.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="md:col-span-1 space-y-6">
                        {/* Department Context */}
                        <Card
                            className={`transition-all duration-500 hover:shadow-xl border-l-[6px] ${selectedDeptStats ? 'border-l-green-500' : 'border-l-red-500'}`}
                        >
                            <CardHeader>
                                <CardTitle className="text-gray-800">
                                    {selectedDeptStats ? selectedDeptStats.name : "Select a Department"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {selectedDeptStats ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4 text-center">
                                            {/* Department Metrics - Now Public */}
                                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                                                <p className="text-2xl font-bold text-blue-900">{selectedDeptStats.metrics?.pendingFiles || 0}</p>
                                                <p className="text-xs text-blue-700 font-medium">Pending Files</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                                                <p className="text-2xl font-bold text-green-900">{selectedDeptStats.metrics?.filesCleared || 0}</p>
                                                <p className="text-xs text-green-700 font-medium">Files Cleared</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200 col-span-2">
                                                <p className="text-3xl font-bold text-purple-900">{selectedDeptStats.metrics?.efficiency || 0}%</p>
                                                <p className="text-xs text-purple-700 font-medium mb-2">Efficiency Score</p>
                                                <div className="w-full bg-purple-200 rounded-full h-2">
                                                    <div
                                                        className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                                                        style={{ width: `${selectedDeptStats.metrics?.efficiency || 0}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-800 mt-2">
                                            Status: <span className="font-semibold text-gray-900">{selectedDeptStats.status}</span>
                                        </p>

                                        {/* Key Officials Section */}
                                        <div className="pt-4 border-t">
                                            <h4 className="text-sm font-bold text-gray-900 mb-3">Key Officials & Contacts</h4>
                                            <KeyOfficialsList deptId={departmentId} />
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-700 italic">Please select a department to view its performance metrics and key officials.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Raise a Grievance / Message Official</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Department</label>
                                <input
                                    className="flex h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm shadow-sm opacity-50 cursor-not-allowed"
                                    value={selectedDeptStats ? selectedDeptStats.name : 'Select a department above'}
                                    readOnly
                                />
                                <p className="text-xs text-gray-700">Select department from the progress section above.</p>
                            </div>

                            {/* Hidden field simulation for now or simple UI hint */}
                            <div className="p-3 bg-yellow-50 text-yellow-800 text-xs rounded border border-yellow-200">
                                <span className="font-bold">Tip:</span> To message a specific official privately, find them in the list above and copy their ID or name into the description, or use the "Message" button next to their name (coming soon).
                                <br />
                                <em>For this demo, all grievances raised here go to the department generally unless addressed specifically.</em>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Title</label>
                                <Input
                                    value={title}
                                    placeholder="e.g. Visa Issue or 'Private Message for Director'"
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <Textarea
                                    rows={4}
                                    value={description}
                                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" disabled={!departmentId}>Submit</Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Your Grievances / Messages</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {grievances.length === 0 ? (
                                <p className="text-gray-800">No records found.</p>
                            ) : (
                                grievances.map((g: any) => (
                                    <div key={g._id} className="border p-4 rounded-lg bg-white shadow-sm">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900">{g.title}</h4>
                                                <p className="text-xs text-indigo-600 font-medium mb-1">{g.addressedTo ? `Private Message (ID: ${g.addressedTo})` : `To: ${g.department?.name}`}</p>
                                                <p className="text-xs text-gray-700">{new Date(g.createdAt).toLocaleDateString()}</p>
                                                {g.reopenedCount > 0 && (
                                                    <p className="text-xs text-orange-600 font-medium mt-1">🔄 Reopened {g.reopenedCount} time(s)</p>
                                                )}
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${g.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                                                    g.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {g.status}
                                                </span>
                                                {/* Reopen Button */}
                                                {(g.status === 'Resolved' || g.status === 'Rejected') && g.canReopen && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-7 text-xs px-2 border-orange-300 text-orange-700 hover:bg-orange-50"
                                                        onClick={async () => {
                                                            try {
                                                                await reopenGrievance(g._id, user._id);
                                                                fetchGrievances();
                                                            } catch (error: any) {
                                                                alert(error.response?.data?.message || 'Error reopening grievance');
                                                            }
                                                        }}
                                                    >
                                                        🔄 Reopen
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                        {g.resolutionNotes && (
                                            <div className="mt-3 text-sm bg-gray-50 p-2 rounded border border-gray-100">
                                                <span className="font-semibold text-gray-900">Reply:</span> {g.resolutionNotes}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// Sub-component to fetch and display officials
function KeyOfficialsList({ deptId }: { deptId: string }) {
    const [officials, setOfficials] = useState([]);
    const [messageModalOpen, setMessageModalOpen] = useState(false);
    const [selectedRecipient, setSelectedRecipient] = useState<any>(null);

    useEffect(() => {
        if (!deptId) return;
        getPublicEmployees(deptId)
            .then((data: any) => setOfficials(data))
            .catch((err: any) => console.error(err));
    }, [deptId]);

    const handleMessageClick = (emp: any) => {
        setSelectedRecipient(emp);
        setMessageModalOpen(true);
    };

    const handleMessageSuccess = () => {
        window.location.reload(); // Refresh to show new message
    };

    if (officials.length === 0) return <p className="text-xs text-gray-700">No public contacts listed.</p>;

    return (
        <>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {officials.map((emp: any) => (
                    <div key={emp._id} className="flex items-start justify-between gap-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all">
                        <div className="flex gap-3">
                            <div className="bg-red-50 text-red-700 h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                                {emp.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">{emp.name}</p>
                                <p className="text-xs text-red-600 font-medium">{emp.role}</p>
                                <p className="text-[10px] text-gray-700 mt-0.5">{emp.email}</p>
                            </div>
                        </div>

                        {/* Message Button - Opens Beautiful Modal */}
                        <Button
                            size="sm"
                            variant="secondary"
                            className="h-7 text-[10px] px-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200"
                            onClick={() => handleMessageClick(emp)}
                        >
                            ✉️ Message
                        </Button>
                    </div>
                ))}
            </div>

            {/* Message Modal */}
            {selectedRecipient && (
                <MessageCard
                    isOpen={messageModalOpen}
                    onClose={() => setMessageModalOpen(false)}
                    recipient={selectedRecipient}
                    departmentId={deptId}
                    onSuccess={handleMessageSuccess}
                />
            )}
        </>
    );
}
