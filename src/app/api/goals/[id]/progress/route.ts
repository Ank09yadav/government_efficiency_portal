
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Goal from '@/models/Goal';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const { progress } = await request.json();

        const goal = await Goal.findById(id);
        if (!goal) {
            return NextResponse.json({ message: 'Goal not found' }, { status: 404 });
        }

        goal.currentValue = progress;

        // Auto-update status check
        if (goal.targetValue > 0 && goal.currentValue >= goal.targetValue) {
            goal.status = 'Completed';
        } else if (goal.currentValue > 0 && goal.status === 'Pending') {
            goal.status = 'In Progress';
        }

        await goal.save();
        return NextResponse.json(goal);
    } catch (error: any) {
        return NextResponse.json({ message: 'Error updating goal', error: error.message }, { status: 500 });
    }
}
