'use client';

import { createBoard } from '@/actions/create-board';
import { FormInput } from '@/components/form/form-input';
import { useAction } from '@/hooks/use-action';
import { FormSubmit } from '@/components/form/form-submit';

const Form = () => {
  const { execute, data, fieldErrors, isLoading } = useAction(createBoard, {
    onSuccess: (data) => {
      console.log(data, 'SUCCESS');
    },
    onError: (error) => {
      console.log(error, 'ERROR');
    },
  });

  const onSubmit = (formData: FormData) => {
    const title = formData.get('title') as string;
    execute({ title });
  };

  return (
    <form action={onSubmit}>
      <div>
        <FormInput
          id='title'
          label='Board Title'
          errors={fieldErrors}
        />
      </div>
      <FormSubmit>Save</FormSubmit>
    </form>
  );
};

export default Form;
