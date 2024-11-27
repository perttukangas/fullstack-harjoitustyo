import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { loginSignupInput } from '@apiv1/user/shared-validators';

import type { LoginSignupInput } from '@tapiv1/user/shared-validators';

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
import { useSession } from '@cc/hooks/use-session';
import { useToast } from '@cc/hooks/use-toast';
import { t } from '@cc/lib/trpc';

interface LoginSignupProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LoginSignup({ open, setOpen }: LoginSignupProps) {
  const { toast } = useToast();
  const tUtils = t.useUtils();
  const { setUser } = useSession();
  const [signup, setSignup] = useState(false);

  const loginMutation = t.user.login.useMutation({
    onSuccess: async (data) => {
      form.reset();
      setUser(data);
      setOpen(false);
      toast({ description: 'You are now logged in!' });
      await tUtils.invalidate();
    },
  });
  const signupMutation = t.user.signup.useMutation({
    onSuccess: () => {
      form.reset();
      setSignup(!signup);
      toast({ description: 'You have successfully signed up!' });
    },
  });

  const messages = {
    title: signup ? 'Signup' : 'Login',
    description: signup ? 'Have an account? ' : "Don't have an account? ",
    descriptionLink: signup ? 'Login' : 'Signup',
  };

  const form = useForm<LoginSignupInput>({
    resolver: zodResolver(loginSignupInput),
    defaultValues: { email: '', password: '' },
  });

  return (
    <DrawerDialog
      title={messages.title}
      description={
        <span>
          {messages.description}
          <Button
            variant="link"
            className="px-0"
            onClick={() => setSignup(!signup)}
          >
            {messages.descriptionLink}
          </Button>
        </span>
      }
      open={open}
      setOpen={setOpen}
      footer={
        <div className="mx-4 mb-2 md:mx-0 md:mb-0">
          <Button
            className="w-full"
            disabled={form.formState.isSubmitting}
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void form.handleSubmit(
                signup
                  ? (data) => signupMutation.mutate(data)
                  : (data) => loginMutation.mutate(data)
              )(e);
            }}
          >
            {messages.title}
          </Button>
        </div>
      }
    >
      <Form {...form}>
        <form className="mx-4 mb-2 md:mx-0 md:mb-0">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
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
