import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import type { EditInput } from '@apiv1/post/comment/validators';
import { editInput } from '@apiv1/post/comment/validators';

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
import { t } from '@cc/lib/trpc';

export default function EditForm(edit: EditInput & { postId: number }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const tUtils = t.useUtils();

  const editMutation = t.post.comment.edit.useMutation({
    onSuccess: async () => {
      await tUtils.post.comment.infinite.invalidate({ postId: edit.postId });
      setOpen(false);
      toast({ description: 'You have successfully edited your comment!' });
    },
  });

  const form = useForm<EditInput>({
    resolver: zodResolver(editInput),
    defaultValues: edit,
  });

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="ghost" size="icon">
        <Pencil />
      </Button>
      {open && (
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
                  void form.handleSubmit((data) => editMutation.mutate(data))(
                    e
                  );
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
                      <Textarea placeholder="My post content" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </DrawerDialog>
      )}
    </>
  );
}
