import { auth } from "@/auth";
import { db } from "@/lib/db";
import { User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import Stripe from 'stripe';


async function findUserById(userId: string): Promise<User | null> {
    const user = await db.user.findFirst({
        where: {
            id: userId,
        }
    });
    return user
}

async function updateUserStripeCustomerId(id: string, id1: string) {
    await db.user.update({
        where: {
            id: id,
        },
        data: {
            stripeCustomerId: id1,
        }
    });
}


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-04-30.basil'
});

// const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const YOUR_DOMAIN = process.env.DNS_FRONT;



// ⛳ Função principal que decide o handler com base em uma chave do corpo da requisição
export async function POST(req: NextRequest) {
    const sessionUser = await auth();
    const userId = sessionUser?.user?.id;

    if (!userId)
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });


    const body = await req.json();
    const lookupKey = body.lookup_key;

    const user = await findUserById(userId);
    if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });

    if (user.hasPayment == true || user.hasPayment == null) {
        return NextResponse.json({ error: 'Usuário já possui um plano' }, { status: 400 });
    }

    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
            email: user.email,
            name: user.name,
            metadata: { userId: user.id },
        });

        stripeCustomerId = customer.id;
        await updateUserStripeCustomerId(user.id, customer.id);
    }

    const prices = await stripe.prices.list({
        lookup_keys: [lookupKey],
        expand: ['data.product'],
    });

    if (!prices.data.length)
        return NextResponse.json({ error: 'Plano não encontrado' }, { status: 400 });

    const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        customer: stripeCustomerId,
        billing_address_collection: 'auto',
        line_items: [{ price: prices.data[0].id, quantity: 1 }],
        subscription_data: {
            //   trial_period_days: user.trialUsed ? undefined : 7,
            trial_period_days: false ? undefined : 7,
        },
        success_url: `${YOUR_DOMAIN}/plans?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${YOUR_DOMAIN}/plans?canceled=true`,
    });

    // unstable_update({
    //     user: {
    //         ...sessionUser.user,
    //         hasPayment: true,
    //     },
    // })


    return NextResponse.json({ url: session.url }, {status: 200});
}
