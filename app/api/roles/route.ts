import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const roles = await prisma.role.findMany({
            orderBy: { name: 'asc' },
        });
        return NextResponse.json(roles);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch roles' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body.name || !body.permissions) {
            return NextResponse.json(
                { error: 'Name and permissions are required' },
                { status: 400 }
            );
        }

        const role = await prisma.role.create({
            data: {
                name: body.name,
                description: body.description || '',
                permissions: body.permissions,
            },
        });

        return NextResponse.json(role, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create role' },
            { status: 500 }
        );
    }
}
