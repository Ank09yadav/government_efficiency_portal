
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        await connectDB();
        const { name, email, password } = await request.json();

        // Basic validation
        if (!name || !email || !password) {
            return NextResponse.json({ message: 'Please provide all fields' }, { status: 400 });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ name, email, password: hashedPassword });

        return NextResponse.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: 'citizen'
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Server Error', error }, { status: 500 });
    }
}
