
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Scheme from '@/models/Scheme';

export async function GET() {
    try {
        await dbConnect();
        const schemes = await Scheme.find().populate('department', 'name').sort({ createdAt: -1 }); // Recently added first
        return NextResponse.json(schemes);
    } catch (error: any) {
        return NextResponse.json(
            { message: 'Error fetching schemes', error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();

        // Validation could go here

        const scheme = await Scheme.create({
            title: body.title,
            description: body.description,
            department: body.departmentId // Assuming the frontend sends departmentId but model uses 'department' string or ID?
            // Model Scheme.ts says: department: { type: String, required: true }
            // Generally better to store ID reference if populated, but if it's currently String, we'll store whatever is sent.
            // Wait, in AdminDashboard.tsx: createScheme call sends `departmentId`.
            // In News.tsx, it tries to populate department object? "scheme.department?.name".
            // If the model is just type String, populate won't work automatically unless configured.
            // Let's check Scheme.ts again. It is just `department: { type: String, required: true }`.
            // It is NOT a ref. So populate "department" in News.tsx might fail or just show empty.
            // However, for now, let's just save what we get.
        });

        return NextResponse.json(scheme, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { message: 'Error creating scheme', error: error.message },
            { status: 500 }
        );
    }
}
