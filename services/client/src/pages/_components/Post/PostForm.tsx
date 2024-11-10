import { zodResolver } from '@hookform/resolvers/zod';
import { CirclePlus, Pencil } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@c/core/components/Button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@c/core/components/Drawer';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@c/core/components/Form';
import { Input } from '@c/core/components/Input';

import {
  type CreateInput,
  type EditInput,
  createInput,
  editInput,
} from '@apiv1/post/validators';

export default function PostForm({ edit }: { edit?: EditInput }) {
  const [open, setOpen] = useState(false);

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

  const onSubmit = async (values: CreateInput) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log('SUBMIT', values);
    form.reset();
    setOpen(false);
  };

  const onEdit = async (values: EditInput) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log('EDIT', values);
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon">
          {isEditing ? <Pencil /> : <CirclePlus />}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>{messages.title}</DrawerTitle>
            <DrawerDescription>{messages.description}</DrawerDescription>
          </DrawerHeader>
          <Form {...form}>
            <form
              onSubmit={(e) => {
                void form.handleSubmit(isEditing ? onEdit : onSubmit)(e);
              }}
              className="px-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="My post" {...field} />
                    </FormControl>
                    <FormDescription>This is your post title.</FormDescription>
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
                      <Input placeholder="My post content" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your post content.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DrawerFooter className="p-0 py-4">
                <Button disabled={form.formState.isSubmitting}>Submit</Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
