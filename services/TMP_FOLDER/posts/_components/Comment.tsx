import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { produce } from 'immer';

import { RouterOutputs } from '@c/core/lib/trpc';
import { t } from '@c/core/lib/trpc';

import { editInput } from '@apiv1/post/comment/validators';

type InfiniteComment =
  RouterOutputs['post']['comment']['infinite']['comments'][0] & {
    postId: number;
  };

export default function Comment({
  _count,
  content,
  id,
  postId,
}: InfiniteComment) {
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

  const commentRemove = t.post.comment.remove.useMutation({
    onSuccess: () => {
      void tUtils.post.comment.infinite.invalidate({ postId });
    },
  });

  const commentEdit = t.post.comment.edit.useMutation({
    onSuccess: () => {
      void tUtils.post.comment.infinite.invalidate({ postId });
    },
  });

  const handleLike = async (commentId: number) => {
    await commentLike.mutateAsync({ commentId });
  };
  const handleRemove = async (commentId: number) => {
    await commentRemove.mutateAsync({ commentId });
  };

  const { Field, handleSubmit, Subscribe } = useForm({
    defaultValues: {
      commentId: id,
      content,
    },
    onSubmit: async ({ value, formApi }) => {
      await commentEdit.mutateAsync(value);
      formApi.reset();
    },
    validatorAdapter: zodValidator(),
    validators: {
      onSubmit: editInput,
    },
  });

  return (
    <>
      <p>{content}</p>
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
      <br />
      <br />
    </>
  );
}
