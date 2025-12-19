
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function PUT(request: Request) {
    try {
        await dbConnect();
        const { userId, ...updates } = await request.json();

        if (!userId) {
            return NextResponse.json({ message: 'User ID required' }, { status: 400 });
        }

        const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error: any) {
        return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
    }
}
