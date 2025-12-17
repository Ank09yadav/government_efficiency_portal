
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        await connectDB();
        const { email, password } = await request.json();

        // Basic validation
        if (!email || !password) {
            return NextResponse.json({ message: 'Please provide email and password' }, { status: 400 });
        }

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            return NextResponse.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: 'citizen'
            });
        } else {
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Server Error', error }, { status: 500 });
    }
}
