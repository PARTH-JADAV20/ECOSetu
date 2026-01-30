import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        console.log('Start seeding via API...');

        // 1. Roles
        const roles = [
            { name: 'Admin', description: 'Full system access and user management', permissions: 'Full Access' },
            { name: 'Engineer', description: 'Can create and modify products, BoMs, and ECOs', permissions: 'Read/Write' },
            { name: 'ECO Manager', description: 'Can approve or reject ECOs', permissions: 'Approve' },
            { name: 'Operations', description: 'Can view and implement approved ECOs', permissions: 'Read/Implement' },
        ];

        for (const role of roles) {
            await prisma.role.upsert({
                where: { name: role.name },
                update: {},
                create: role,
            });
        }

        // 2. Users
        const users = [
            {
                name: 'System Admin',
                email: 'admin@example.com',
                password: 'password123',
                role: 'Admin',
                status: 'Active',
            },
            {
                name: 'Sarah Engineer',
                email: 'engineer@example.com',
                password: 'password123',
                role: 'Engineer',
                status: 'Active',
            },
            {
                name: 'Michael Approver',
                email: 'approver@example.com',
                password: 'password123',
                role: 'ECO Manager',
                status: 'Active',
            },
        ];

        for (const user of users) {
            await prisma.user.upsert({
                where: { email: user.email },
                update: {},
                create: user,
            });
        }

        // 3. Products
        const products = [
            {
                productId: 'P001',
                name: 'Office Chair Deluxe',
                category: 'Furniture',
                currentVersion: 'v2.3',
                salePrice: 459.99,
                costPrice: 287.50,
                sku: 'SKU-OCD-001',
            },
            {
                productId: 'P002',
                name: 'Industrial Pump XR-500',
                category: 'Industrial',
                currentVersion: 'v1.8',
                salePrice: 2450.00,
                costPrice: 1680.00,
                sku: 'SKU-IPX-500',
            },
        ];

        for (const product of products) {
            await prisma.product.upsert({
                where: { productId: product.productId },
                update: {},
                create: product,
            });
        }

        return NextResponse.json({ message: 'Database seeded successfully via API' });
    } catch (error: any) {
        console.error('Seeding error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
