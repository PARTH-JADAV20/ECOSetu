import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const search = searchParams.get('search') || '';
        const stage = searchParams.get('stage');
        const type = searchParams.get('type');
        const status = searchParams.get('status');

        const where: any = {};

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { ecoId: { contains: search, mode: 'insensitive' } },
                { product: { name: { contains: search, mode: 'insensitive' } } },
            ];
        }

        if (stage && stage !== 'all') where.stage = stage;
        if (type && type !== 'all') where.type = type;
        if (status && status !== 'all') where.status = status;

        const ecos = await prisma.eCO.findMany({
            where,
            include: {
                product: {
                    select: { name: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        const formattedECOs = ecos.map(eco => ({
            id: eco.ecoId,
            title: eco.title,
            type: eco.type,
            product: eco.product.name,
            stage: eco.stage,
            effectiveDate: eco.effectiveDate.toISOString().split('T')[0],
            status: eco.status,
        }));

        return NextResponse.json(formattedECOs);
    } catch (error) {
        console.error('Error fetching ECOs:', error);
        return NextResponse.json(
            { error: 'Failed to fetch ECOs' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const eco = await prisma.eCO.create({
            data: {
                ecoId: body.ecoId, // Generate or pass
                title: body.title,
                type: body.type,
                stage: 'Draft',
                status: 'Draft',
                effectiveDate: new Date(body.effectiveDate),
                createdBy: body.createdBy,
                description: body.description,
                productId: body.productId, // Internal ID
                changes: {
                    create: body.changes?.map((c: any) => ({
                        component: c.component,
                        field: c.field,
                        oldValue: c.oldValue,
                        newValue: c.newValue,
                        highlight: c.highlight
                    }))
                }
            },
        });

        return NextResponse.json(eco, { status: 201 });
    } catch (error) {
        console.error('Error creating ECO:', error);
        return NextResponse.json(
            { error: 'Failed to create ECO' },
            { status: 500 }
        );
    }
}
