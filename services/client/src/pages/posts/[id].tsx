import { useForm } from '@tanstack/react-form';
import { LoaderFnContext, useMatch } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { produce } from 'immer';
import { z } from 'zod';

import InfiniteScroll from '@c/core/components/InfiniteScroll';
import Spinner from '@c/core/components/Spinner';
import { clientUtils, t } from '@c/core/utils/trpc';

import { createInput } from '@apiv1/post/comment/validators';

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
  const commentLike = t.post.comment.like.useMutation({
    onSuccess: (_data, variables) => {
      const { commentId } = variables;
      tUtils.post.comment.infinite.setInfiniteData({ postId }, (oldData) => {
        return !oldData
          ? oldData
          : produce(oldData, (draft) => {
              for (const page of draft.pages) {
                if (!page.nextCursor || page.nextCursor < commentId) {
                  for (const comment of page.comments) {
                    if (comment.id === commentId) {
                      comment._count.likes += 1;
                      break;
                    }
                  }
                  break;
                }
              }
            });
      });
    },
  });

  const { data, status } = infinitePostComments;
  const allRows = data ? data.pages.flatMap((d) => d.comments) : [];

  const handleLike = async (commentId: number) => {
    await commentLike.mutateAsync({ commentId });
  };

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
        renderRow={(item) => (
          <>
            <p>{item.content}</p>
            <p>Likes: {item._count.likes}</p>
            <button
              onClick={() => {
                void handleLike(item.id);
              }}
            >
              Like
            </button>
          </>
        )}
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
                  <input
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
