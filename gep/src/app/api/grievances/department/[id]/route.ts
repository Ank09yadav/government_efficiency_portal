
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Grievance from '@/models/Grievance';
import User from '@/models/User';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();

        const { id } = await params;

        const grievances = await Grievance.find({ department: id })
            .populate('raisedBy', 'name email')
            .sort({ createdAt: -1 });

        return NextResponse.json(grievances);
    } catch (error: any) {
        return NextResponse.json(
            { message: 'Error fetching grievances', error: error.message },
            { status: 500 }
        );
    }
}
