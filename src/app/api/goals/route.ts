
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Goal from '@/models/Goal';

export async function GET() {
    try {
        await dbConnect();
        const goals = await Goal.find().sort({ createdAt: -1 });
        return NextResponse.json(goals);
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching goals', error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const goal = await Goal.create(body);
        return NextResponse.json(goal, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error creating goal', error: error.message }, { status: 500 });
    }
}
