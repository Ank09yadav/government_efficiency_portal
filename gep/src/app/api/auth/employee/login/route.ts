
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Department from '@/models/Department';
// We import employees statically as per original project
import { employees } from '@/data/employees';

export async function POST(request: Request) {
    try {
        // connectDB needed for Department lookup
        await connectDB();
        const { email, password } = await request.json();

        const employee = employees.find(e => e.email === email);

        if (employee && employee.password === password) {
            // Find department ID for the frontend to use
            const department = await Department.findOne({ username: employee.departmentUsername });

            return NextResponse.json({
                _id: employee.id, // Use static ID for employee
                name: employee.name,
                email: employee.email,
                role: 'employee',
                rank: employee.rank,
                department: department ? department._id : null,
                departmentName: department ? department.name : 'Unknown Dept'
            });
        } else {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Server Error', error }, { status: 500 });
    }
}
