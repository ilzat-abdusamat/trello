import { FormInput } from '@/components/form/form-input';
import { CardWithList } from '@/types';
import { LayoutIcon } from 'lucide-react';
import { ElementRef, useRef, useState } from 'react';

interface HeaderProps {
  data: CardWithList;
}

export const Header = ({ data }: HeaderProps) => {
  const [title, setTitle] = useState(data.title);

  const inputRef = useRef<ElementRef<'input'>>(null);

  const onSubmit = (formData: FormData) => {
    const title = formData.get('title') as string;
  };

  const onBlur = () => {
    inputRef.current?.form?.requestSubmit();
  };

  return (
    <div>
      <LayoutIcon />
      <div>
        <form action={onSubmit}>
          <FormInput
            onBlur={onBlur}
            ref={inputRef}
            id='title'
            defaultValue={title}
          />
        </form>
        <p>
          in list <span className='underline'>{data.list.title}</span>
        </p>
      </div>
    </div>
  );
};

Header.Skeleton = function Skeleton() {
  return <div>loading</div>;
};
