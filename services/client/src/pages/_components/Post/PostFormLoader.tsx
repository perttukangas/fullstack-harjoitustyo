import { CirclePlus, Pencil } from 'lucide-react';
import { Suspense, lazy, useState } from 'react';

import { Button } from '@c/core/components/Button';
import Loader from '@c/core/components/Loader';

import { type EditInput } from '@apiv1/post/validators';

const PostForm = lazy(() => import('./PostForm'));

export default function PostFormLoader({ edit }: { edit?: EditInput }) {
  const [open, setOpen] = useState(false);
  const isEditing = !!edit;

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="ghost" size="icon">
        {isEditing ? <Pencil /> : <CirclePlus />}
      </Button>
      {open && (
        <Suspense fallback={<Loader />}>
          <PostForm edit={edit} open={open} setOpen={setOpen} />
        </Suspense>
      )}
    </>
  );
}
