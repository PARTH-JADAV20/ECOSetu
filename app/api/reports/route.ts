import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const reportType = searchParams.get('type');

        if (reportType === 'eco') {
            const data = await prisma.eCO.findMany({
                include: { product: { select: { name: true } } },
                orderBy: { createdAt: 'desc' }
            });
            return NextResponse.json(data);
        }

        if (reportType === 'product-version') {
            const data = await prisma.productVersion.findMany({
                include: { product: { select: { name: true } } },
                orderBy: { date: 'desc' }
            });
            return NextResponse.json(data);
        }

        if (reportType === 'bom-changes') {
            // Assuming we track BoM changes logic similar to ECO
            // Or fetch BoMs ordered by updated at
            const data = await prisma.boM.findMany({
                include: { product: { select: { name: true } } },
                orderBy: { updatedAt: 'desc' },
                take: 100 // Limit
            });
            return NextResponse.json(data);
        }

        if (reportType === 'archived') {
            const data = await prisma.product.findMany({
                where: { status: 'Archived' },
                include: { versions: { take: 1, orderBy: { date: 'desc' } } }
            });
            return NextResponse.json(data);
        }

        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch report data' },
            { status: 500 }
        );
    }
}
