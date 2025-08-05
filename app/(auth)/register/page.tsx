'use client';
import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { Button } from '@/components/ui/button';
import { authClient } from '@/auth-client';
import { toast } from 'sonner';
import { LoaderIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { InputPassword } from '../_components/InputPassword';
import { registerSchema } from '@/schema/authSchema';

type FormValues = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const router = useRouter();
  const [isPending, setPending] = React.useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });
  const onSubmit = async ({ name, email, password }: FormValues) => {
    await authClient.signUp.email(
      {
        name,
        email,
        password,
        contact: '',
        bio: '',
      },
      {
        onRequest: () => {
          setPending(true);
        },
        onSuccess: () => {
          toast.success(
            'Your account has been created. Check your email for a verification link.',
            {
              style: { color: 'green' },
            },
          );
          router.push('/');
        },
        onError: ctx => {
          console.log('error', ctx);
          toast.error(`${ctx.error.message ?? 'Something went wrong'}`, {
            style: { color: 'red' },
          });
        },
      },
    );
    setPending(false);
  };
  return (
    <div className="flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl font-medium">Create an account</CardTitle>
          <CardDescription className="text-muted-foreground font-light">
            Enter below information to create an account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-8">
              <div className="space-y-4">
                {/* name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor={field.name} className="text-inherit">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          id={field.name}
                          placeholder="eg: Hari Bahadur Shrestha"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor={field.name} className="text-inherit">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          id={field.name}
                          placeholder="eg: hari@example.com"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor={field.name} className="text-inherit">
                        Password
                      </FormLabel>
                      <FormControl>
                        <InputPassword
                          id={field.name}
                          placeholder="*********"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button disabled={isPending} className="cursor-pointer">
                {isPending && <LoaderIcon className="animate-spin" />}
                {isPending ? 'Registering user....' : 'Register'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <div className="text-muted-foreground w-full text-center text-sm">
            Already have an account?
            <Link href={'/login'} className="text-primary mx-2 hover:underline">
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;
