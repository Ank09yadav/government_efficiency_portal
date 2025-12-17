
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Department from '@/models/Department';
import { employees } from '@/data/employees';

export async function GET(request: Request, context: { params: any }) {
    const { deptId } = await context.params;
    try {
        await connectDB();

        // Find department to get username
        const department = await Department.findById(deptId);

        if (!department) return NextResponse.json([]);

        const deptUsername = department.username;

        const deptEmployees = employees.filter(e =>
            e.departmentUsername === deptUsername && e.isPublicContact
        ).sort((a, b) => b.rank - a.rank);

        const result = deptEmployees.map(e => ({
            _id: e.id,
            name: e.name,
            role: e.role,
            email: e.email,
            city: e.city,
            state: e.state
        }));

        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ message: 'Server Error', error }, { status: 500 });
    }
}
