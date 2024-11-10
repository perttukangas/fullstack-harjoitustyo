import { useForm } from '@tanstack/react-form';
import { LoaderFnContext, useMatch } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';

import InfiniteScroll from '@c/core/components/InfiniteScroll';
import Spinner from '@c/core/components/Spinner';
import { clientUtils, t } from '@c/core/lib/trpc';

import { createInput } from '@apiv1/post/comment/validators';

import Comment from './_components/Comment';

export const Pending = () => <Spinner />;
export const Loader = async (context: LoaderFnContext) => {
  const parsedParams = z
    .object({ id: z.string().transform((val) => parseInt(val)) })
    .parse(context.params);
  const prefetch = await clientUtils.post.comment.infinite.prefetchInfinite({
    postId: parsedParams.id,
  });
  return { prefetch };
};

export default function Id() {
  const { params } = useMatch({ from: '/posts/$id' });
  const postId = Number(params.id);
  const infinitePostComments = t.post.comment.infinite.useInfiniteQuery(
    { postId },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    }
  );

  const tUtils = t.useUtils();

  const { data, status } = infinitePostComments;
  const allRows = data ? data.pages.flatMap((d) => d.comments) : [];

  const createMutation = t.post.comment.create.useMutation({
    onSuccess: () => {
      void tUtils.post.comment.infinite.invalidate({});
    },
  });

  const { Field, handleSubmit, Subscribe } = useForm({
    defaultValues: {
      postId,
      content: '',
    },
    onSubmit: async ({ value, formApi }) => {
      await createMutation.mutateAsync(value);
      formApi.reset();
    },
    validatorAdapter: zodValidator(),
    validators: {
      onSubmit: createInput,
    },
  });

  if (status === 'error') {
    return <p>Error...</p>;
  }

  return (
    <>
      <InfiniteScroll
        className="infinite-scroll-post-comments"
        allRows={allRows}
        renderRow={(comment) => <Comment postId={postId} {...comment} />}
        height={500}
        estimateSize={100}
        {...infinitePostComments}
      />
      <div>
        <h1>Create</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void handleSubmit();
          }}
        >
          <div>
            <Field name="content">
              {(field) => (
                <div>
                  <label htmlFor={field.name}>Content:</label>
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                    }}
                  />
                  {field.state.meta.errors.length > 0 ? (
                    <em role="alert">{field.state.meta.errors.join(', ')}</em>
                  ) : null}
                </div>
              )}
            </Field>
          </div>
          <Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <button type="submit" disabled={!canSubmit}>
                {isSubmitting ? '...' : 'Submit'}
              </button>
            )}
          </Subscribe>
        </form>
      </div>
    </>
  );
}
