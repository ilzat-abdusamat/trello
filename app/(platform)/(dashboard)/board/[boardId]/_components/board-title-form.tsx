'use client';

import { ElementRef, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Board } from '@prisma/client';
import { FormInput } from '@/components/form/form-input';
import { useAction } from '@/hooks/use-action';
import { updateBoard } from '@/actions/update-board';
import { toast } from 'sonner';

interface BoardTitleFormProps {
  data: Board;
}

export const BoardTitleForm = ({ data }: BoardTitleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.title);
  const formRef = useRef<ElementRef<'form'>>(null);
  const inputRef = useRef<ElementRef<'input'>>(null);

  const { execute } = useAction(updateBoard, {
    onSuccess: (data) => {
      toast.success(`Board "${data.title}" updated!`);
      disableEditing();
      setTitle(data.title);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onBlur = () => {
    formRef.current?.requestSubmit();
  };

  const onSubmit = (formData: FormData) => {
    const title = formData.get('title') as string;
    execute({
      title,
      id: data.id,
    });
  };

  return (
    <>
      {isEditing ? (
        <form
          ref={formRef}
          action={onSubmit}
          className='flex items-center gap-x-2'
        >
          <FormInput
            ref={inputRef}
            onBlur={onBlur}
            id='title'
            defaultValue={title}
            className='text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none'
          />
        </form>
      ) : (
        <Button
          className='font-bold text-lg h-auto w-auto p-1 px-2'
          variant='transparent'
          onClick={enableEditing}
        >
          {title}
        </Button>
      )}
    </>
  );
};
