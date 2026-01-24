import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        // ECO Status Distribution
        const ecoStatusGroups = await prisma.eCO.groupBy({
            by: ['status'],
            _count: {
                status: true
            }
        });

        const ecoStatusData = ecoStatusGroups.map(g => ({
            name: g.status,
            value: g._count.status,
            // Colors would be assigned on frontend
        }));

        // Product Categories
        const productCategoryGroups = await prisma.product.groupBy({
            by: ['category'],
            _count: {
                category: true
            }
        });

        const productCategoryData = productCategoryGroups.map(g => ({
            category: g.category,
            count: g._count.category
        }));

        // ECO Trend (Simulated using createdAt for months)
        // Complex date grouping is DB specific, typically raw query or JS processing
        // Here fetching last 6 months generally and processing in JS for simplicity
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const recentECOs = await prisma.eCO.findMany({
            where: { createdAt: { gte: sixMonthsAgo } },
            select: { createdAt: true, status: true }
        });

        // Process for trend array... (Simplified logic placeholder)
        const ecoTrendData: any[] = [];
        // ... logic to aggregate created vs approved per month

        return NextResponse.json({
            ecoStatusData,
            productCategoryData,
            // ecoTrendData
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch chart data' },
            { status: 500 }
        );
    }
}
