import { Trash } from 'lucide-react';
import { Suspense, lazy, useState } from 'react';

import type { RemoveInput } from '@apiv1/post/validators';

import { Button } from '@cc/components/Button';
import Loader from '@cc/components/Loader';

const RemovePost = lazy(() => import('./RemovePost'));

export default function RemovePostLoader({ id }: RemoveInput) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="ghost" size="icon">
        <Trash />
      </Button>
      {open && (
        <Suspense fallback={<Loader />}>
          <RemovePost id={id} open={open} setOpen={setOpen} />
        </Suspense>
      )}
    </>
  );
}
