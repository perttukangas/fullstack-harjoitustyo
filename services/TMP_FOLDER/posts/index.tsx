import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';

import InfiniteScroll from '@c/core/components/InfiniteScroll';
import Spinner from '@c/core/components/Spinner';
import { clientUtils, t } from '@c/core/lib/trpc';

import { createInput } from '@apiv1/post/validators';

import Post from './_components/Post';

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

  const { data, status } = infinitePosts;
  const allRows = data ? data.pages.flatMap((d) => d.posts) : [];

  const postCreate = t.post.create.useMutation({
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
      await postCreate.mutateAsync(value);
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
        renderRow={(post) => <Post {...post} />}
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
                    type="text"
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
