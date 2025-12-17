"use client";

import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updatePassword, updateProfile } from '@/lib/api';

export default function Settings() {
    // Safely get user/employee from localStorage in useEffect to avoid hydration mismatch
    // But for simplicity in this migration, we'll try to get it, or handle it in useEffect.
    // Better to use state initialized in useEffect for localStorage.

    const [mounted, setMounted] = useState(false);
    const [user, setUser] = useState<any>({});
    const [employee, setEmployee] = useState<any>({});

    useState(() => {
        if (typeof window !== 'undefined') {
            setUser(JSON.parse(localStorage.getItem('user') || '{}'));
            setEmployee(JSON.parse(localStorage.getItem('employee') || '{}'));
            setMounted(true);
        }
    });

    // User ID to use for API calls
    const targetId = user._id || employee._id;
    const isEmployee = !!employee._id;

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [occupation, setOccupation] = useState('');
    const [phone, setPhone] = useState('');

    // Census States
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [annualIncome, setAnnualIncome] = useState('');
    const [employmentStatus, setEmploymentStatus] = useState('');

    // Initialize state from user object once mounted
    useState(() => {
        if (user._id) {
            setAddress(user.address || '');
            setCity(user.city || '');
            setState(user.state || '');
            setOccupation(user.occupation || '');
            setPhone(user.phone || '');
            setAge(user.age || '');
            setGender(user.gender || '');
            setAnnualIncome(user.annualIncome || '');
            setEmploymentStatus(user.employmentStatus || '');
        }
    });

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("New passwords don't match!");
            return;
        }

        try {
            await updatePassword({
                userId: targetId,
                currentPassword,
                newPassword
            });
            alert('Password updated successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || 'Error updating password');
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await updateProfile({
                userId: user._id,
                type: user.role === 'employee' ? 'Employee' : 'User',
                address,
                city,
                state,
                occupation,
                phone,
                age,
                gender,
                annualIncome,
                employmentStatus
            });
            const newUser = { ...user, ...res.data };
            localStorage.setItem('user', JSON.stringify(newUser));
            setUser(newUser);
            alert('Profile updated successfully!');
        } catch (error: any) {
            console.error(error);
            alert('Error updating profile');
        }
    };

    if (!mounted) return null;

    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold text-red-900">Account Settings</h1>

            <div className="grid gap-6 md:grid-cols-2">
                {!isEmployee && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Details</CardTitle>
                            <CardDescription>Update your personal information for official records.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleProfileUpdate} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Occupation</label>
                                        <Input value={occupation} onChange={(e) => setOccupation(e.target.value)} placeholder="e.g. Teacher" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Phone</label>
                                        <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91..." />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Address</label>
                                    <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House No, Street..." />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">City</label>
                                        <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">State</label>
                                        <Input value={state} onChange={(e) => setState(e.target.value)} placeholder="State" />
                                    </div>
                                </div>

                                {/* Additional Details Section */}
                                <div className="pt-4 border-t border-red-100">
                                    <h3 className="text-md font-bold text-red-800 mb-3">Additional Personal Details</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Age</label>
                                            <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Annual Income (₹)</label>
                                            <Input type="number" value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} placeholder="Annual Income" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Gender</label>
                                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3" value={gender} onChange={(e) => setGender(e.target.value)}>
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Employment Status</label>
                                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3" value={employmentStatus} onChange={(e) => setEmploymentStatus(e.target.value)}>
                                                <option value="">Select Status</option>
                                                <option value="Employed">Employed</option>
                                                <option value="Unemployed">Unemployed</option>
                                                <option value="Student">Student</option>
                                                <option value="Retired">Retired</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">Save Profile Details</Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                        <CardDescription>Ensure your account is secure using a strong password.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Current Password</label>
                                <div className="relative">
                                    <Input
                                        type={showCurrent ? "text" : "password"}
                                        value={currentPassword}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentPassword(e.target.value)}
                                        required
                                        className="pr-10"
                                    />
                                    <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {showCurrent ? "👁️" : "🙈"}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">New Password</label>
                                <div className="relative">
                                    <Input
                                        type={showNew ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                                        required
                                        className="pr-10"
                                    />
                                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {showNew ? "👁️" : "🙈"}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Confirm New Password</label>
                                <div className="relative">
                                    <Input
                                        type={showConfirm ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                                        required
                                        className="pr-10"
                                    />
                                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {showConfirm ? "👁️" : "🙈"}
                                    </button>
                                </div>
                            </div>
                            <Button type="submit" className="w-full bg-gray-800 hover:bg-black text-white">Update Password</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div >
    );
}
