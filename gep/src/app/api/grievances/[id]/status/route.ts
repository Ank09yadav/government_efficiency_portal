
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Grievance from '@/models/Grievance';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await request.json();

        const grievance = await Grievance.findByIdAndUpdate(
            id,
            {
                status: body.status,
                resolutionNotes: body.resolutionNotes,
                updatedAt: Date.now(),
                closedAt: body.status === 'Resolved' || body.status === 'Rejected' ? Date.now() : undefined
            },
            { new: true }
        );

        if (!grievance) {
            return NextResponse.json({ message: 'Grievance not found' }, { status: 404 });
        }

        return NextResponse.json(grievance);
    } catch (error: any) {
        return NextResponse.json(
            { message: 'Error updating grievance status', error: error.message },
            { status: 500 }
        );
    }
}
