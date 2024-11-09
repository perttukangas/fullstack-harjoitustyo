import { useForm } from '@tanstack/react-form';
import { Link } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { produce } from 'immer';

import InfiniteScroll from '@c/core/components/InfiniteScroll';
import Spinner from '@c/core/components/Spinner';
import { clientUtils, t } from '@c/core/utils/trpc';

import { createInput } from '@apiv1/post/validators';

export const Pending = () => <Spinner />;
export const Loader = async () => {
  const prefetch = await clientUtils.post.infinite.prefetchInfinite({});
  return { prefetch };
};

export default function Index() {
  const infinitePosts = t.post.infinite.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    }
  );

  const tUtils = t.useUtils();
  const postLike = t.post.like.useMutation({
    onSuccess: (_data, variables) => {
      const { postId } = variables;
      tUtils.post.infinite.setInfiniteData({}, (oldData) => {
        return !oldData
          ? oldData
          : produce(oldData, (draft) => {
              for (const page of draft.pages) {
                if (!page.nextCursor || page.nextCursor < postId) {
                  for (const post of page.posts) {
                    if (post.id === postId) {
                      post._count.likes += 1;
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

  const { data, status } = infinitePosts;
  const allRows = data ? data.pages.flatMap((d) => d.posts) : [];

  const handleLike = async (postId: number) => {
    await postLike.mutateAsync({ postId });
  };

  const createMutation = t.post.create.useMutation({
    onSuccess: () => {
      void tUtils.post.infinite.invalidate({});
    },
  });

  const { Field, handleSubmit, Subscribe } = useForm({
    defaultValues: {
      content: '',
      title: '',
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
        className="infinite-scroll-posts"
        allRows={allRows}
        renderRow={(item) => (
          <>
            <Link to="/posts/$id" params={{ id: item.id.toString() }}>
              {item.title}
            </Link>
            <p>
              {item.id} {item.content}
            </p>
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
        {...infinitePosts}
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
            <Field name="title">
              {(field) => (
                <div>
                  <label htmlFor={field.name}>Title:</label>
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
