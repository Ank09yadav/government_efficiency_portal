
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET() {
    try {
        await dbConnect();

        const genderDistribution = await User.aggregate([
            { $group: { _id: "$gender", count: { $sum: 1 } } },
            { $match: { _id: { $ne: null } } }
        ]);

        const employmentDistribution = await User.aggregate([
            { $group: { _id: "$employmentStatus", count: { $sum: 1 } } },
            { $match: { _id: { $ne: null } } }
        ]);

        const occupationDistribution = await User.aggregate([
            { $group: { _id: '$occupation', count: { $sum: 1 } } },
            { $match: { _id: { $nin: [null, ""] } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        return NextResponse.json({
            genderDistribution,
            employmentDistribution,
            occupationDistribution
        });
    } catch (error: any) {
        return NextResponse.json(
            { message: 'Error fetching census stats', error: error.message },
            { status: 500 }
        );
    }
}
