import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button } from '@c/core/components/Button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@c/core/components/Form';
import { Textarea } from '@c/core/components/Textarea';

import { type CreateInput, createInput } from '@apiv1/post/comment/validators';

export default function CreateForm({
  postId,
}: {
  postId: CreateInput['postId'];
}) {
  const form = useForm<CreateInput>({
    resolver: zodResolver(createInput),
    defaultValues: { content: '', postId },
  });

  const onSubmit = async (values: CreateInput) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log('SUBMIT', values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          void form.handleSubmit(onSubmit)(e);
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
