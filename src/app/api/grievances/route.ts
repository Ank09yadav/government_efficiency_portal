
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Grievance from '@/models/Grievance';

export async function POST(request: Request) {
    try {
        await connectDB();
        const { title, description, department, raisedBy, addressedTo, isAnonymous } = await request.json();
        const grievance = await Grievance.create({
            title,
            description,
            department,
            raisedBy,
            addressedTo,
            isAnonymous: isAnonymous || false,
            status: 'Pending'
        });
        return NextResponse.json(grievance, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Error creating grievance', error }, { status: 400 });
    }
}
