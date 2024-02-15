'use client';

import { Button } from '@/components/ui/button';
import { useFormStatus } from 'react-dom';

const DeleteButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      variant='destructive'
      size='sm'
      disabled={pending}
    >
      Delete
    </Button>
  );
};

export default DeleteButton;
