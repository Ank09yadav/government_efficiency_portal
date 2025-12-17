
"use client";

import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';

interface MessageCardProps {
    isOpen: boolean;
    onClose: () => void;
    recipient: {
        _id: string;
        name: string;
        role: string;
        email: string;
    };
    departmentId: string;
    onSuccess: () => void;
}

export default function MessageCard({ isOpen, onClose, recipient, departmentId, onSuccess }: MessageCardProps) {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (!user._id) {
                setError('Please login first');
                setLoading(false);
                return;
            }

            await axios.post('/api/grievances', {
                title: `Private: ${title}`,
                description: message,
                department: departmentId,
                raisedBy: user._id,
                addressedTo: recipient._id,
                isAnonymous: isAnonymous
            });

            // Success - reset form and close
            setTitle('');
            setMessage('');
            setIsAnonymous(false);
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error(error);
            setError(error.response?.data?.message || 'Error sending message');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg mx-4 animate-in zoom-in-95 duration-200">
                <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
                    <CardHeader className="space-y-1 bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                    <span className="text-2xl">✉️</span>
                                </div>
                                <div>
                                    <CardTitle className="text-xl text-red-900">Send Private Message</CardTitle>
                                    <p className="text-sm text-gray-700 mt-1">
                                        To: <span className="font-semibold text-red-700">{recipient.name}</span>
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-600 hover:text-gray-800 transition-colors"
                                disabled={loading}
                            >
                                <span className="text-2xl">×</span>
                            </button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm animate-in slide-in-from-top-2">
                                    <div className="flex items-center gap-2">
                                        <span>⚠️</span>
                                        <span>{error}</span>
                                    </div>
                                </div>
                            )}

                            {/* Recipient Info Card */}
                            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border border-red-100">
                                <div className="flex items-start gap-3">
                                    <div className="bg-red-100 text-red-700 h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                                        {recipient.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900">{recipient.name}</p>
                                        <p className="text-sm text-red-600 font-medium">{recipient.role}</p>
                                        <p className="text-xs text-gray-700 mt-1">{recipient.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Anonymous Toggle */}
                            <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex-1">
                                    <label htmlFor="anonymous" className="text-sm font-semibold text-gray-900 cursor-pointer">
                                        Send Anonymously
                                    </label>
                                    <p className="text-xs text-gray-800 mt-1">
                                        Your identity will be hidden from the recipient
                                    </p>
                                </div>
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        id="anonymous"
                                        checked={isAnonymous}
                                        onChange={(e) => setIsAnonymous(e.target.checked)}
                                        disabled={loading}
                                        className="sr-only peer"
                                    />
                                    <label
                                        htmlFor="anonymous"
                                        className="block w-14 h-8 bg-gray-200 peer-checked:bg-red-600 rounded-full cursor-pointer transition-all duration-200 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"
                                    >
                                        <span className="block w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 translate-x-1 translate-y-1 peer-checked:translate-x-7"></span>
                                    </label>
                                </div>
                            </div>

                            {/* Title Input */}
                            <div className="space-y-2">
                                <label htmlFor="title" className="text-sm font-medium text-gray-900">
                                    Subject <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="title"
                                    placeholder="Brief subject of your message"
                                    value={title}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                                    required
                                    disabled={loading}
                                    className="border-red-200 focus-visible:ring-red-500"
                                />
                            </div>

                            {/* Message Textarea */}
                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium text-gray-900">
                                    Message <span className="text-red-500">*</span>
                                </label>
                                <Textarea
                                    id="message"
                                    rows={5}
                                    placeholder="Type your message here..."
                                    value={message}
                                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                                    required
                                    disabled={loading}
                                    className="border-red-200 focus-visible:ring-red-500 resize-none"
                                />
                                <p className="text-xs text-gray-700 text-right">
                                    {message.length} characters
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    disabled={loading}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-red-700 hover:bg-red-800 text-white shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="animate-spin">⏳</span>
                                            Sending...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <span>📤</span>
                                            Send Message
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
