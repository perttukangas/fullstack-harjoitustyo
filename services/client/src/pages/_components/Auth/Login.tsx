import { zodResolver } from '@hookform/resolvers/zod';
import { User } from 'lucide-react';
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

import {
  type LoginRegisterInput,
  loginRegisterInput,
} from '@apiv1/user/validators';

export default function Login() {
  const [open, setOpen] = useState(false);
  const [signup, setSignup] = useState(false);

  const messages = {
    title: signup ? 'Signup' : 'Login',
    description: signup ? 'Have an account? ' : "Don't have an account? ",
    descriptionLink: signup ? 'Login' : 'Signup',
  };

  const form = useForm<LoginRegisterInput>({
    resolver: zodResolver(loginRegisterInput),
    defaultValues: { email: '', password: '' },
  });

  const onLogin = async (values: LoginRegisterInput) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log('LOGIN', values);
    form.reset();
    setOpen(false);
  };

  const onSignup = async (values: LoginRegisterInput) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log('SIGNUP', values);
    form.reset();
    setOpen(false);
  };

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
              void form.handleSubmit(signup ? onSignup : onLogin)(e);
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
