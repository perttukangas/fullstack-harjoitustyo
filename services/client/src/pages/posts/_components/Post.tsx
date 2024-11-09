import { useForm } from '@tanstack/react-form';
import { Link } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { produce } from 'immer';

import { RouterOutputs } from '@c/core/utils/trpc';
import { t } from '@c/core/utils/trpc';

import { editInput } from '@apiv1/post/validators';

type InfinitePost = RouterOutputs['post']['infinite']['posts'][0];

export default function Post({ _count, content, id, title }: InfinitePost) {
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

  const postRemove = t.post.remove.useMutation({
    onSuccess: () => {
      void tUtils.post.infinite.invalidate({});
    },
  });

  const postEdit = t.post.edit.useMutation({
    onSuccess: () => {
      void tUtils.post.infinite.invalidate({});
    },
  });

  const handleLike = async (postId: number) => {
    await postLike.mutateAsync({ postId });
  };

  const handleRemove = async (postId: number) => {
    await postRemove.mutateAsync({ postId });
  };

  const { Field, handleSubmit, Subscribe } = useForm({
    defaultValues: {
      postId: id,
      content,
      title,
    },
    onSubmit: async ({ value, formApi }) => {
      await postEdit.mutateAsync(value);
      formApi.reset();
    },
    validatorAdapter: zodValidator(),
    validators: {
      onSubmit: editInput,
    },
  });

  return (
    <>
      <Link to="/posts/$id" params={{ id: id.toString() }}>
        {title}
      </Link>
      <p>
        {id} {content}
      </p>
      <p>Likes: {_count.likes}</p>
      <button
        onClick={() => {
          void handleLike(id);
        }}
      >
        Like
      </button>
      <button
        onClick={() => {
          void handleRemove(id);
        }}
      >
        Delete
      </button>
      <div>
        <p>Edit</p>
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
      <br />
      <br />
    </>
  );
}
