
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Department from '@/models/Department';

export async function GET() {
    try {
        await connectDB();
        const departments = await Department.find();
        const totalDepartments = departments.length;
        const totalFilesCleared = departments.reduce((acc, dept) => acc + (dept.metrics?.filesCleared || 0), 0);

        return NextResponse.json({
            totalDepartments,
            totalFilesCleared,
            timestamp: new Date()
        });
    } catch (error) {
        return NextResponse.json({ message: 'Server Error', error }, { status: 500 });
    }
}
