'use client';

import { stripeRedirect } from '@/actions/stripe-redirect';
import { Button } from '@/components/ui/button';
import { useAction } from '@/hooks/use-action';
import { useProModal } from '@/hooks/use-pro-modal';
import { toast } from 'sonner';

interface SubscriptionButtonProps {
  isPro: boolean;
}

export const SubscriptionButton = ({ isPro }: SubscriptionButtonProps) => {
  const proModal = useProModal();

  const { execute } = useAction(stripeRedirect, {
    onSuccess: (url) => {
      window.location.href = url;
    },
  });

  const onClick = () => {
    if (isPro) {
      execute({});
    } else {
      proModal.onOpen();
    }
  };

  return (
    <Button
      variant='primary'
      onClick={onClick}
    >
      {isPro ? 'Manage Subscriptions' : 'Upgrade'}
    </Button>
  );
};
