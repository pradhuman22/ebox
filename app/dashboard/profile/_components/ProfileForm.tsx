'use client';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2Icon } from 'lucide-react';
import { authClient, Session } from '@/auth-client';
import { useRouter } from 'next/navigation';
import { uploadImageToCloudinaryAction } from '@/lib/upload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputPassword } from '@/app/(auth)/_components/InputPassword';
import { profileSchema } from '@/schema/authSchema';

type FormValues = z.infer<typeof profileSchema>;

const ProfileForm = ({ user }: { user: Session['user'] }) => {
  const router = useRouter();
  const [isPending, setPending] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || '',
      email: user.email || '',
      image: user.image || '',
      contact: user.contact || '',
      bio: user.bio || '',
      currentPassword: '',
      password: '',
      confirmPassword: '',
    },
  });
  const watchedImage = form.watch('image');
  const onSubmit = async ({ image, name, password, currentPassword, bio, contact }: FormValues) => {
    await authClient.updateUser(
      {
        image,
        name,
        contact,
        bio,
      },
      {
        onRequest: () => {
          setPending(true);
        },
        onError: () => {
          toast.error('Failed to update profile', {
            style: {
              color: 'red',
            },
          });
        },
        onSuccess: () => {
          toast.success('Updated successfully', {
            style: {
              color: 'green',
            },
          });
          router.refresh();
        },
      },
    );
    if (password && currentPassword) {
      await authClient.changePassword({
        newPassword: password,
        currentPassword,
        revokeOtherSessions: true,
      });
    }
    setPending(false);
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    const result = await uploadImageToCloudinaryAction('users', formData);
    setLoading(false);
    if (result.url) {
      form.setValue('image', result.url);
    } else {
      toast.error(result.error, {
        style: { color: 'red' },
      });
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="relative aspect-square h-32 cursor-pointer rounded-full border-2">
                {loading ? (
                  <div className="flex h-full w-full flex-col items-center justify-center">
                    <Loader2Icon className="animate-spin" />
                  </div>
                ) : watchedImage ? (
                  <Image
                    src={watchedImage || ''}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="bg-primary/10 rounded-full border-2 object-cover"
                  />
                ) : (
                  ''
                )}
              </div>
              <div className="relative w-fit overflow-hidden md:overflow-auto">
                <h1 className="line-clamp-1 text-2xl font-semibold text-ellipsis">{user.name}</h1>
                <p className="line-clamp-1">{user.email}</p>
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem className="pt-3">
                      <FormLabel
                        htmlFor="image"
                        className={buttonVariants({
                          variant: 'outline',
                          size: 'sm',
                          className: 'bg-accent w-fit cursor-pointer',
                        })}
                      >
                        Upload new photo
                      </FormLabel>
                      <FormControl>
                        <Input
                          accept="image/*"
                          hidden
                          id="image"
                          type="file"
                          name={field.name}
                          onBlur={field.onBlur}
                          onChange={handleFileChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* full name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base text-inherit">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="eg: Hari Bahadur Shrestha"
                        className="border-accent"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base text-inherit">Email</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        {...field}
                        placeholder="eg: hari@example.com"
                        className="border-accent"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base text-inherit">Phone</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="eg: 1234567890" className="border-accent" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base text-inherit">Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="eg: Describe yourself.."
                        className="border-accent h-40 resize-none"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password. Make sure to use a strong one.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FormField
                name="currentPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base text-inherit">Current Password</FormLabel>
                    <FormControl>
                      <InputPassword
                        {...field}
                        placeholder="Current Password"
                        className="border-accent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base text-inherit">New Password</FormLabel>
                    <FormControl>
                      <InputPassword
                        {...field}
                        placeholder="New Password"
                        className="border-accent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="confirmPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base text-inherit">Confirm Password</FormLabel>
                    <FormControl>
                      <InputPassword
                        {...field}
                        placeholder="Confirm Password"
                        className="border-accent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>
        <Button className="mt-8 w-full cursor-pointer">
          {isPending && <Loader2Icon className="animate-spin" />}
          {isPending ? 'Updating profile...' : 'Update Profile'}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
