import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        // Calculate unread count
        // This could also be a separate endpoint or header
        // const unreadCount = notifications.filter(n => n.isUnread).length;

        return NextResponse.json(notifications);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch notifications' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, notificationId, userId, message, type } = body;

        // Mark as read
        if (action === 'mark-read' && notificationId) {
            await prisma.notification.update({
                where: { id: notificationId },
                data: { isUnread: false }
            });
            return NextResponse.json({ success: true });
        }

        // Mark all as read
        if (action === 'mark-all-read' && userId) {
            await prisma.notification.updateMany({
                where: { userId },
                data: { isUnread: false }
            });
            return NextResponse.json({ success: true });
        }

        // Create notification
        if (userId && message && type) {
            const notification = await prisma.notification.create({
                data: {
                    userId,
                    message,
                    type,
                    isUnread: true
                }
            });
            return NextResponse.json(notification, { status: 201 });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to process notification' },
            { status: 500 }
        );
    }
}
