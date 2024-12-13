import { zodResolver } from '@hookform/resolvers/zod';
import { produce } from 'immer';
import { Send } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { type UnparsedCreateInput, createInput } from '@shared/zod/comment';
import { UnparsedDefaultId } from '@shared/zod/common';

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
import { compareEqual, compareLessThan } from '@cc/utils/bigint';

interface CreateProps {
  postId: UnparsedDefaultId;
}

export default function Create({ postId }: CreateProps) {
  const { toast } = useToast();
  const tUtils = t.useUtils();

  const form = useForm<UnparsedCreateInput>({
    resolver: zodResolver(createInput),
    defaultValues: { content: '', postId },
  });

  const createMutation = t.post.comment.create.useMutation({
    onSuccess: async () => {
      await tUtils.post.comment.infinite.invalidate({ postId });
      tUtils.post.infinite.setInfiniteData({}, (oldData) => {
        return !oldData
          ? oldData
          : produce(oldData, (draft) => {
              for (const page of draft.pages) {
                if (
                  !page.nextCursor ||
                  compareLessThan(page.nextCursor, postId)
                ) {
                  for (const post of page.posts) {
                    if (compareEqual(post.id, postId)) {
                      post.comments += 1;
                      break;
                    }
                  }
                  break;
                }
              }
            });
      });
      form.reset();
      toast({ description: 'You have successfully created a new comment!' });
    },
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
