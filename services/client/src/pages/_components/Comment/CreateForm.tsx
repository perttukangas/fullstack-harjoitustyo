import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
import { useForm } from 'react-hook-form';

import type { CreateInput } from '@apiv1/post/comment/validators';
import { createInput } from '@apiv1/post/comment/validators';

import { Button } from '@cc/components/Button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@cc/components/Form';
import { Textarea } from '@cc/components/Textarea';
import { useToast } from '@cc/hooks/use-toast';
import { t } from '@cc/lib/trpc';

export default function CreateForm({
  postId,
}: {
  postId: CreateInput['postId'];
}) {
  const { toast } = useToast();
  const tUtils = t.useUtils();

  const createMutation = t.post.comment.create.useMutation({
    onSuccess: async () => {
      await tUtils.post.comment.infinite.invalidate({ postId });
      form.reset();
      toast({ description: 'You have successfully created a new comment!' });
    },
  });

  const form = useForm<CreateInput>({
    resolver: zodResolver(createInput),
    defaultValues: { content: '', postId },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          void form.handleSubmit((data) => createMutation.mutate(data))(e);
        }}
      >
        <div className="flex w-full flex-row items-center justify-between gap-1">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="w-full p-4 md:p-0">
                <FormControl>
                  <Textarea placeholder="My comment content" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button variant="ghost" size="icon">
            <Send />
          </Button>
        </div>
      </form>
    </Form>
  );
}
