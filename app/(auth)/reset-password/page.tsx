'use client';
import Link from 'next/link';
import React, { Suspense } from 'react';
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

import { Button } from '@/components/ui/button';
import { authClient } from '@/auth-client';
import { toast } from 'sonner';
import { LoaderIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { InputPassword } from '../_components/InputPassword';
import { resetPasswordSchema } from '@/schema/authSchema';

type FormValues = z.infer<typeof resetPasswordSchema>;

const ResetPasswordContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || undefined;
  const [isPending, setPending] = React.useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });
  const onSubmit = async ({ password }: FormValues) => {
    setPending(true);
    const { error } = await authClient.resetPassword({
      newPassword: password,
      token: token,
    });
    if (error) {
      toast.error(error.message, {
        style: { color: 'red' },
      });
    } else {
      toast.success('Password reset successful. Login to continue.', {
        style: {
          color: 'green',
        },
      });
      router.push('/login');
    }
    setPending(false);
  };
  return (
    <div className="flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl font-medium">Reset Password</CardTitle>
          <CardDescription className="text-muted-foreground font-light">
            Enter new password to reset your account password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-8">
              <div className="space-y-4">
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
                {/* confirm password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor={field.name} className="text-inherit">
                        Confirm Password
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
                {isPending ? 'Reseting password..' : 'Reset Password'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <div className="text-muted-foreground w-full text-center text-sm">
            Remember Password?
            <Link href={'/login'} className="text-primary mx-2 hover:underline">
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}
