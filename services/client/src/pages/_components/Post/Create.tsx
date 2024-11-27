import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { createInput } from '@apiv1/post/shared-validators';

import type { CreateInput } from '@tapiv1/post/shared-validators';

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
import { t } from '@cc/lib/trpc';

interface CreateProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Create({ open, setOpen }: CreateProps) {
  const { toast } = useToast();
  const tUtils = t.useUtils();

  const form = useForm<CreateInput>({
    resolver: zodResolver(createInput),
    defaultValues: { content: '', title: '' },
  });

  const createMutation = t.post.create.useMutation({
    onSuccess: async () => {
      form.reset();
      setOpen(false);
      await tUtils.post.infinite.reset({});
      toast({ description: 'You have successfully created a new post!' });
    },
  });

  return (
    <DrawerDialog
      title="Create post"
      description="Create new post for everyone to see!"
      open={open}
      setOpen={setOpen}
      footer={
        <div className="mx-4 mb-2 md:mx-0 md:mb-0">
          <Button
            className="w-full"
            disabled={form.formState.isSubmitting}
            onClick={(e) => {
              void form.handleSubmit((data) => createMutation.mutate(data))(e);
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
