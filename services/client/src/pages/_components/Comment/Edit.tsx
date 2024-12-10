import { zodResolver } from '@hookform/resolvers/zod';
import { produce } from 'immer';
import { useForm } from 'react-hook-form';

import { type EditInput, editInput } from '@shared/zod/comment';

import { Button } from '@cc/components/Button';
import DrawerDialog from '@cc/components/DrawerDialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@cc/components/Form';
import { Textarea } from '@cc/components/Textarea';
import { useToast } from '@cc/hooks/use-toast';
import { type RouterOutputs, t } from '@cc/lib/trpc';

type InfinitePost = RouterOutputs['post']['infinite']['posts'][0]['id'];
type InfiniteComment =
  RouterOutputs['post']['comment']['infinite']['comments'][0];

interface editProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  postId: InfinitePost;
  row: InfiniteComment;
}

export default function Edit({ open, setOpen, postId, row }: editProps) {
  const { toast } = useToast();
  const tUtils = t.useUtils();

  const form = useForm<EditInput>({
    resolver: zodResolver(editInput),
    defaultValues: row,
  });

  const editMutation = t.post.comment.edit.useMutation({
    onSuccess: (_, variables) => {
      const { id } = variables;
      tUtils.post.comment.infinite.setInfiniteData({ postId }, (oldData) => {
        return !oldData
          ? oldData
          : produce(oldData, (draft) => {
              for (const page of draft.pages) {
                if (!page.nextCursor || page.nextCursor < id) {
                  for (const comment of page.comments) {
                    if (comment.id === id) {
                      comment.content = variables.content;
                      break;
                    }
                  }
                  break;
                }
              }
            });
      });
      setOpen(false);
      toast({ description: 'You have successfully edited your comment!' });
    },
  });

  return (
    <DrawerDialog
      title="Edit comment"
      description="Edit your comment!"
      open={open}
      setOpen={setOpen}
      footer={
        <div className="mx-4 mb-2 md:mx-0 md:mb-0">
          <Button
            className="w-full"
            disabled={form.formState.isSubmitting}
            onClick={(e) => {
              void form.handleSubmit((data) => editMutation.mutate(data))(e);
            }}
          >
            Submit
          </Button>
        </div>
      }
    >
      <Form {...form}>
        <form className="mx-4 mb-2 md:mx-0 md:mb-0">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea placeholder="My comment content" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </DrawerDialog>
  );
}
