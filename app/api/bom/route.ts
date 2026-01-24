import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status');

        const where: any = {};

        if (search) {
            where.OR = [
                { bomId: { contains: search, mode: 'insensitive' } },
                { product: { name: { contains: search, mode: 'insensitive' } } },
            ];
        }

        if (status && status !== 'all') {
            where.status = status;
        }

        const boms = await prisma.boM.findMany({
            where,
            include: {
                product: {
                    select: { name: true },
                },
            },
            orderBy: { updatedAt: 'desc' },
        });

        const formattedBoMs = boms.map(bom => ({
            id: bom.bomId,
            productName: bom.product.name,
            version: bom.version,
            status: bom.status,
            componentsCount: bom.componentsCount,
        }));

        return NextResponse.json(formattedBoMs);
    } catch (error) {
        console.error('Error fetching BoMs:', error);
        return NextResponse.json(
            { error: 'Failed to fetch BoMs' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Basic validation
        if (!body.productId || !body.bomId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const bom = await prisma.boM.create({
            data: {
                bomId: body.bomId,
                productId: body.productId, // Use internal ID
                version: body.version || 'v1.0',
                status: 'Active',
                componentsCount: body.components?.length || 0,
                components: {
                    create: body.components?.map((c: any) => ({
                        name: c.name,
                        quantity: c.quantity,
                        unit: c.unit,
                        supplier: c.supplier,
                    })),
                },
                operations: {
                    create: body.operations?.map((op: any) => ({
                        name: op.name,
                        time: op.time,
                        unit: op.unit,
                        workCenter: op.workCenter,
                    })),
                },
            },
        });

        return NextResponse.json(bom, { status: 201 });
    } catch (error) {
        console.error('Error creating BoM:', error);
        return NextResponse.json(
            { error: 'Failed to create BoM' },
            { status: 500 }
        );
    }
}
