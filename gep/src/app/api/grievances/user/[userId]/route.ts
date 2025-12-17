
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Grievance from '@/models/Grievance';

// We need to export a specific type for params in Next.js 13+ route handlers to avoid type errors
// But typically { params } is passed as second arg

export async function GET(request: Request, context: { params: any }) {
    // Typescript might complain about params type if not using proper Next types, but 'any' is safe for quick port
    const { userId } = await context.params;
    try {
        await connectDB();
        // Ensure dept is populated
        // In Mongoose Next.js ensure connection established
        const grievances = await Grievance.find({ raisedBy: userId }).populate('department', 'name');
        return NextResponse.json(grievances);
    } catch (error) {
        return NextResponse.json({ message: 'Server Error', error }, { status: 500 });
    }
}
