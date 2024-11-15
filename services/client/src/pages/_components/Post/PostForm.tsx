import { zodResolver } from '@hookform/resolvers/zod';
import { CirclePlus, Pencil } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@c/core/components/Button';
import DrawerDialog from '@c/core/components/DrawerDialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@c/core/components/Form';
import { Input } from '@c/core/components/Input';
import { Textarea } from '@c/core/components/Textarea';
import { useToast } from '@c/core/hooks/use-toast';
import { t } from '@c/core/lib/trpc';

import { type EditInput, createInput, editInput } from '@apiv1/post/validators';

export default function PostForm({ edit }: { edit?: EditInput }) {
  const { toast } = useToast();
  const tUtils = t.useUtils();
  const [open, setOpen] = useState(false);
  const createMutation = t.post.create.useMutation({
    onSuccess: async () => {
      await tUtils.post.infinite.invalidate({});
      form.reset();
      setOpen(false);
      toast({ description: 'You have successfully created a new post!' });
    },
  });
  const editMutation = t.post.edit.useMutation({
    onSuccess: async () => {
      await tUtils.post.infinite.invalidate({});
      setOpen(false);
      toast({ description: 'You have successfully edited your post!' });
    },
  });

  const isEditing = !!edit;
  const messages = {
    title: isEditing ? 'Edit post' : 'Create post',
    description: isEditing
      ? 'Edit your post!'
      : 'Create new post for everyone to see!',
  };

  const form = useForm<EditInput>({
    resolver: zodResolver(isEditing ? editInput : createInput),
    defaultValues: isEditing ? edit : { content: '', title: '' },
  });

  return (
    <DrawerDialog
      trigger={
        <Button onClick={() => setOpen(true)} variant="ghost" size="icon">
          {isEditing ? <Pencil /> : <CirclePlus />}
        </Button>
      }
      title={messages.title}
      description={messages.description}
      open={open}
      setOpen={setOpen}
      footer={
        <div className="mx-4 mb-2 md:mx-0 md:mb-0">
          <Button
            className="w-full"
            disabled={form.formState.isSubmitting}
            onClick={(e) => {
              void form.handleSubmit(
                isEditing
                  ? (data) => editMutation.mutate(data)
                  : (data) => createMutation.mutate(data)
              )(e);
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
