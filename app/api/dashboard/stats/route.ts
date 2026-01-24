import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const [
            productsCount,
            activeBoMsCount,
            openECOsCount,
            pendingApprovalsCount
        ] = await Promise.all([
            prisma.product.count(),
            prisma.boM.count({ where: { status: 'Active' } }),
            prisma.eCO.count({ where: { status: { notIn: ['Completed', 'Rejected', 'Archived'] } } }),
            prisma.eCO.count({ where: { status: 'Pending Approval' } })
            // Trends calculation would require more complex queries comparing dates
        ]);

        return NextResponse.json({
            products: productsCount,
            activeBoMs: activeBoMsCount,
            openECOs: openECOsCount,
            pendingApprovals: pendingApprovalsCount
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch dashboard stats' },
            { status: 500 }
        );
    }
}
