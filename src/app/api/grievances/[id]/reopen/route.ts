
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Grievance from '@/models/Grievance';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await request.json(); // Expecting userId potentially for audit, though not strictly used in logic below

        const grievance = await Grievance.findById(id);
        if (!grievance) {
            return NextResponse.json({ message: 'Grievance not found' }, { status: 404 });
        }

        if (!grievance.canReopen) {
            return NextResponse.json({ message: 'This grievance cannot be reopened.' }, { status: 400 });
        }

        grievance.status = 'Pending';
        grievance.reopenedCount += 1;
        grievance.updatedAt = Date.now();
        // optionally log who reopened it if needed

        await grievance.save();

        return NextResponse.json(grievance);
    } catch (error: any) {
        return NextResponse.json(
            { message: 'Error reopening grievance', error: error.message },
            { status: 500 }
        );
    }
}
