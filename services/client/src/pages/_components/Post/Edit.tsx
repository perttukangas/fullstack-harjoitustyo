import { zodResolver } from '@hookform/resolvers/zod';
import { produce } from 'immer';
import { useForm } from 'react-hook-form';

import { type EditInput, editInput } from '@shared/zod/post';

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
import { Input } from '@cc/components/Input';
import { Textarea } from '@cc/components/Textarea';
import { useToast } from '@cc/hooks/use-toast';
import { type RouterOutputs, t } from '@cc/lib/trpc';

type InfinitePost = RouterOutputs['post']['infinite']['posts'][0];

interface EditProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  row: InfinitePost;
}

export default function Edit({ open, setOpen, row }: EditProps) {
  const { toast } = useToast();
  const tUtils = t.useUtils();

  const form = useForm<EditInput>({
    resolver: zodResolver(editInput),
    defaultValues: row,
  });

  const editMutation = t.post.edit.useMutation({
    onSuccess: (_, variables) => {
      const { id } = variables;
      tUtils.post.infinite.setInfiniteData({}, (oldData) => {
        return !oldData
          ? oldData
          : produce(oldData, (draft) => {
              for (const page of draft.pages) {
                if (!page.nextCursor || page.nextCursor < id) {
                  for (const post of page.posts) {
                    if (post.id === id) {
                      post.content = variables.content;
                      post.title = variables.title;
                      break;
                    }
                  }
                  break;
                }
              }
            });
      });
      setOpen(false);
      toast({ description: 'You have successfully edited your post!' });
    },
  });

  return (
    <DrawerDialog
      title="Edit post"
      description="Edit your post!"
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
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="My post" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea placeholder="My post content" {...field} />
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
