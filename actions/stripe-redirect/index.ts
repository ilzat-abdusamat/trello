'use server';

import { auth, currentUser } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { absoluteUrl } from '@/lib/utils';
import { createSafeAction } from '@/lib/create-safe-action';
import { stripe } from '@/lib/stripe';

import { StripeRedirect } from './schema';
import { InputType, ReturnType } from './types';

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  const user = await currentUser();

  if (!userId || !orgId || !user) {
    return {
      error: 'Unauthorized',
    };
  }

  const settingsUrl = absoluteUrl(`/organization/${orgId}`);

  let url = '';

  try {
    const orgSubcription = await db.orgSubscription.findUnique({
      where: { orgId },
    });

    if (orgSubcription && orgSubcription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: orgSubcription.stripeCustomerId,
        return_url: settingsUrl,
      });

      url = stripeSession.url;
    } else {
      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        success_url: settingsUrl,
        cancel_url: settingsUrl,
        billing_address_collection: 'auto',
        customer_email: user.emailAddresses[0].emailAddress,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Taskify Pro',
                description: 'Unlimited boards for your organization',
              },
              recurring: {
                interval: 'month',
              },
              unit_amount: 3500,
            },
            quantity: 1,
          },
        ],
        metadata: {
          orgId,
        },
      });

      url = stripeSession.url || '';
    }
  } catch (error) {
    return {
      error: 'Something went wrong!',
    };
  }

  revalidatePath(`/organization/${orgId}`);
  return { data: url };
};

export const stripeRedirect = createSafeAction(StripeRedirect, handler);
