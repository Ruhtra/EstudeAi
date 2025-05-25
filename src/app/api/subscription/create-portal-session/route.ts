import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from "@/auth";
import { db } from '@/lib/db';
import { User } from '@prisma/client';

async function findUserById(userId: string): Promise<User | null> {
    const user = await db.user.findFirst({
        where: {
            id: userId,
        }
    });
    return user
}



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-04-30.basil'
});

export async function POST() {
    try {
        const sessionUser = await auth();
        const userId = sessionUser?.user?.id;

        const user = await findUserById(userId);

        if (!user || !user.stripeCustomerId) {
            return NextResponse.json({ error: 'Usuário ou cliente Stripe não encontrado' }, { status: 404 });
        }

        const returnUrl = process.env.DNS_FRONT+ '/student';

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: user.stripeCustomerId,
            return_url: returnUrl,
        });

        return NextResponse.json({ url: portalSession.url });
    } catch (error) {
        console.error('Erro ao criar sessão do portal:', error);
        return NextResponse.json({ error: 'Erro ao criar sessão do portal' }, { status: 500 });
    }
}
