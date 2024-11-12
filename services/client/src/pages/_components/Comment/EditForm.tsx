import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil } from 'lucide-react';
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
import { Textarea } from '@c/core/components/Textarea';

import { type EditInput, editInput } from '@apiv1/post/comment/validators';

export default function EditForm(edit: EditInput) {
  const [open, setOpen] = useState(false);

  const form = useForm<EditInput>({
    resolver: zodResolver(editInput),
    defaultValues: edit,
  });

  const onEdit = async (values: EditInput) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log('EDIT', values);
    setOpen(false);
  };

  return (
    <DrawerDialog
      trigger={
        <Button onClick={() => setOpen(true)} variant="ghost" size="icon">
          <Pencil />
        </Button>
      }
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
              void form.handleSubmit(onEdit)(e);
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
  );
}
