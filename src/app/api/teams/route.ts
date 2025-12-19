
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Team from '@/models/Team';
import Department from '@/models/Department'; // Ensure model is compiled

export async function GET() {
    try {
        await dbConnect();
        const teams = await Team.find().populate('department', 'name');
        return NextResponse.json(teams);
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching teams', error: error.message }, { status: 500 });
    }
}
