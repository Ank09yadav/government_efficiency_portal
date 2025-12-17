
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Department from '@/models/Department';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        await connectDB();
        const { username, password } = await request.json();

        const department = await Department.findOne({ username });

        if (department && department.password && (await bcrypt.compare(password, department.password))) {
            return NextResponse.json({
                _id: department._id,
                name: department.name,
                role: 'department'
            });
        } else {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Server Error', error }, { status: 500 });
    }
}
