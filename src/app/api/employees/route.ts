
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Employee from '@/models/Employee';
import Team from '@/models/Team';
import Department from '@/models/Department';

export async function GET() {
    try {
        await dbConnect();
        const employees = await Employee.find()
            .populate('team', 'name')
            .populate('department', 'name')
            .select('-password');
        return NextResponse.json(employees);
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching employees', error: error.message }, { status: 500 });
    }
}
