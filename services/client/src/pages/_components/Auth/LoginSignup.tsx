import { zodResolver } from '@hookform/resolvers/zod';
import { CirclePower, User } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@c/core/components/AlertDialog';
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
import { useSession } from '@c/core/hooks/use-session';
import { useToast } from '@c/core/hooks/use-toast';
import { t } from '@c/core/lib/trpc';

import {
  type LoginSignupInput,
  loginSignupInput,
} from '@apiv1/user/validators';

export default function LoginSignup() {
  const { toast } = useToast();
  const tUtils = t.useUtils();
  const { user, setUser } = useSession();
  const [open, setOpen] = useState(false);
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
  const logoutMutation = t.user.logout.useMutation({
    onSuccess: async () => {
      setUser(undefined);
      setOpen(false);
      toast({ description: 'You have successfully logged out!' });
      await tUtils.invalidate();
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

  if (user) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <CirclePower />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm log out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out? You will need to log in again to
              access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => logoutMutation.mutate()}>
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <DrawerDialog
      trigger={
        <Button onClick={() => setOpen(true)} variant="ghost" size="icon">
          <User />
        </Button>
      }
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
            onClick={(e) => {
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
