// app/api/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
// import { Readable } from 'stream';
import { PlanType } from '@prisma/client';
import { db } from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;


// Atualizar o tipo de plano do usuário
async function updateUserPlanType(userId: string, planType: string | null) {


    let mappedPlanType: PlanType | null = null;

    // if (!planType) {
        switch (planType) {
            case 'plano_anual':
                mappedPlanType = PlanType.ANNUAL;
                break;
            case 'plano_mensal':
                mappedPlanType = PlanType.MONTHLY;
                break;
            // default:
            //     throw new Error(`Tipo de plano desconhecido: ${planType}`);
        }
    // }

    await db.user.update({
        where: { id: userId },
        data: { planType: mappedPlanType },
    });
}

// Liberar acesso
async function liberarUsuario(userId: string) {
    console.log(`✅ Liberado acesso do usuário: ${userId}`);
    
    await db.user.update({
        where: { id: userId },
        data: { hasPayment: true},
    });
    // Aqui você pode alterar status do usuário se quiser, ex:
    // await db.user.update({ where: { id: userId }, data: { status: "active" } });
}

// Bloquear acesso
async function bloquearUsuario(userId: string) {
    console.log(`🚫 Bloqueado acesso do usuário: ${userId}`);
    
    await db.user.update({
        where: { id: userId },
        data: { hasPayment: false},
    });
}

async function trialUsed(userId: string) {
    console.log(`🚫 trial do usuário usada: ${userId}`);
    
    await db.user.update({
        where: { id: userId },
        data: { trialUsed: true},
    });
}

async function limpasUsuario(userId: string) {
    console.log(`🚫 Limpando acesso do usuário: ${userId}`);
    
    await db.user.update({
        where: { id: userId },
        data: { hasPayment: false},
    });
}


// Utilitário para transformar ReadableStream em Buffer
// async function buffer(readable: ReadableStream<Uint8Array>) {
//   const reader = readable.getReader();
//   const chunks: Uint8Array[] = [];
//   let done = false;

//   while (!done) {
//     const { value, done: isDone } = await reader.read();
//     if (value) chunks.push(value);
//     done = isDone;
//   }

//   return Buffer.concat(chunks);
// }

export async function POST(req: NextRequest) {
  const rawBody = await req.text(); // ⚠️ captura o body cru como string
  
  const sig = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    console.error('❌ Webhook error:', err);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new NextResponse(`Webhook Error: ${(err as any).message}`, { status: 400 });
  }

  switch (event.type) {
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
      const userId = customer.metadata.userId;

      console.log('✅ Pagamento confirmado com sucesso!');
      console.log('🔗 userId do metadata:', userId);

      if (userId) {
        await liberarUsuario(userId);
      }
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
      const userId = customer.metadata.userId;
      const lookupKey = subscription.items.data[0]?.price.lookup_key || null;

      if (userId && lookupKey) {
        await updateUserPlanType(userId, lookupKey);
      } else {
        console.error(`❗ Erro: lookupKey não encontrado para userId: ${userId}, subscriptionId: ${subscription.id}`);
      }

      break;
    }

    case 'customer.subscription.created': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
      const userId = customer.metadata.userId;
      const lookupKey = subscription.items.data[0]?.price.lookup_key || null;

      if (userId && lookupKey) {
        await updateUserPlanType(userId, lookupKey);
        await trialUsed(userId);
      } else {
        console.error(`❗ Erro: lookupKey não encontrado para userId: ${userId}, subscriptionId: ${subscription.id}`);
      }

      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
      const userId = customer.metadata.userId;

      if (userId) {
        await limpasUsuario(userId);
        await updateUserPlanType(userId, null);
      } else {
        console.error(`❗ Erro: userId não encontrado no metadata para subscriptionId: ${subscription.id}`);
      }

      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
      const userId = customer.metadata.userId;

      console.log('❌ Pagamento falhou');
      console.log('🔗 userId do metadata:', userId);

      if (userId) {
        await bloquearUsuario(userId);
      }

      break;
    }

    default:
      console.log(`🔍 Unhandled event type ${event.type}`);
      break;
  }

  return new NextResponse(null, { status: 200 });
}
