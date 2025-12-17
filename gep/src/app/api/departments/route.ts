
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Department from '@/models/Department';

export async function GET() {
    try {
        await connectDB();
        const departments = await Department.find();
        return NextResponse.json(departments);
    } catch (error) {
        return NextResponse.json({ message: 'Server Error', error }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const newDepartment = await Department.create(body);
        return NextResponse.json(newDepartment, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Error creating department', error }, { status: 400 });
    }
}
