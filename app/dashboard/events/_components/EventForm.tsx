'use client';
import React, { useState, useTransition } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { Category, Event, Ticket } from '@/prisma/generated/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/date-picker';
import TimePicker from '@/components/time-picker';
import { cn } from '@/lib/utils';
import { ticketType } from '@/constant';
import { Button } from '@/components/ui/button';
import {
  Loader2Icon,
  PlusCircleIcon,
  Trash2Icon,
  UploadCloudIcon,
  XCircleIcon,
} from 'lucide-react';
import { deleteImageFromCloudinaryAction, uploadImageToCloudinaryAction } from '@/lib/upload';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { createEventAction, updateEventAction } from '../../actions/event';
import { eventSchema } from '@/schema/eventSchema';
import { useRouter } from 'next/navigation';

type FormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  categories: Category[];
  event?: Event & {
    tickets: Ticket[];
  };
}

type imageStates = {
  id: number;
  isLoading: boolean;
  url: string | null;
};

const EventForm = ({ categories, event }: EventFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [imageStates, setImageStates] = useState<imageStates[]>(
    event?.images
      ? event.images.map((url, id) => ({
          id,
          isLoading: false,
          url,
        }))
      : [],
  );
  const form = useForm<FormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event?.title || '',
      description: event?.description || '',
      time: event?.schedule
        ? new Date(event.schedule).toLocaleTimeString('ja-JP', {
            hour: '2-digit',
            minute: '2-digit',
          })
        : '09:00',
      date: new Date(event?.schedule ?? Date.now()),
      venue: event?.venue || '',
      status: (event?.status as 'Draft' | 'Published' | 'Finished' | 'Cancelled') || 'Draft',
      tickets: event?.tickets?.map(t => ({ type: t.type, price: String(t.price) })) || [
        { type: 'General Admission', price: '0' },
      ],
      images: event?.images || [],
      capacity: event?.capacity || '',
      categoryId: event?.categoryId || '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'tickets',
  });

  console.log(imageStates);

  /** upload image to cloudinary */
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    for (const file of Array.from(files)) {
      const tempId = Date.now();
      setImageStates(prev => [...prev, { id: tempId, isLoading: true, url: null }]);
      const formData = new FormData();
      formData.append('file', file);
      try {
        const result = await uploadImageToCloudinaryAction('events', formData);
        if (result.success && result.url) {
          form.setValue('images', [...form.getValues('images'), result.url]);
          setImageStates(prev => prev.map(s => (s.id === tempId ? { ...s, url: result.url } : s)));
        } else {
          throw new Error('upload failed');
        }
      } catch (error) {
        console.log(error);
        toast.error('Failed to upload image', {
          style: { color: 'red' },
        });
      } finally {
        setImageStates(prev => prev.map(s => (s.id === tempId ? { ...s, isLoading: false } : s)));
      }
    }
  };

  /** remove image from cloudinary */
  const removeImage = async (stateId: number) => {
    console.log(stateId);
    const imageState = imageStates.find(s => s.id === stateId);
    if (!imageStates || !imageState?.url) return;
    /** remove from ui immediately */
    setImageStates(prev => prev.filter(s => s.id !== stateId));
    /** delete from cloudinary */
    if (imageState.url) {
      const result = await deleteImageFromCloudinaryAction(imageState.url);
      if (!result?.succes) {
        toast.error(result?.message, {
          style: {
            color: 'red',
          },
        });
        setImageStates(prev => [...prev, imageState].sort((a, b) => a.id - b.id));
      } else {
        form.setValue(
          'images',
          form.getValues('images').filter(image => image !== imageState.url),
        );
      }
    } else {
      console.warn('Cannot delete image without url.');
    }
  };

  /** form submit function */
  const onSubmit = (data: FormData) => {
    const toastId = toast.loading(event ? 'Updating event...' : 'Creating event...');
    startTransition(async () => {
      try {
        if (event) {
          router.prefetch('/dashboard/events');
        }
        const response = event
          ? await updateEventAction(event.slug, data)
          : await createEventAction(data);
        if (response?.success) {
          toast.success(response.message, {
            id: toastId,
            style: { color: 'green' },
          });
          // Navigate after success
          router.push('/dashboard/events');
          // Refresh in background
          router.refresh();
        } else {
          toast.error(response?.message || 'Operation failed', {
            id: toastId,
            style: { color: 'red' },
          });
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        toast.error(errorMessage, {
          id: toastId,
          style: { color: 'red' },
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* event detail section */}
        <Card>
          <CardContent className="space-y-6">
            {/* title */}
            <FormField
              control={form.control}
              name={'title'}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-base text-inherit">
                    Event Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      placeholder="eg: Taylor Swift - The Eras Tour"
                      className="capitalize"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* description */}
            <FormField
              control={form.control}
              name={'description'}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={field.name} className="text-base text-inherit">
                    Event Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      id={field.name}
                      placeholder="eg: A spectacular concert with all the hits.."
                      {...field}
                      className="h-44"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* category and status */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* category */}
              <FormField
                control={form.control}
                name={'categoryId'}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name} className="text-base text-inherit">
                      Event Category
                    </FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem value={category.id} key={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* status */}
              <FormField
                control={form.control}
                name={'status'}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name} className="text-base text-inherit">
                      Event Status
                    </FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="Published">Published</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                          <SelectItem value="Finished">Finished</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* venue */}
              <FormField
                control={form.control}
                name={'venue'}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name} className="text-base text-inherit">
                      Event Venue
                    </FormLabel>
                    <FormControl>
                      <Input
                        id={field.name}
                        placeholder="eg: A spectacular concert with all the hits.."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* capacity */}
              <FormField
                control={form.control}
                name={'capacity'}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name} className="text-base text-inherit">
                      Event Capacity
                    </FormLabel>
                    <FormControl>
                      <Input id={field.name} placeholder="eg: 2000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* venue and schedule */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* date */}
              <FormField
                control={form.control}
                name={'date'}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name} className="text-base text-inherit">
                      Event Date
                    </FormLabel>
                    <FormControl>
                      <DatePicker value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* time */}
              <FormField
                control={form.control}
                name={'time'}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name} className="text-base text-inherit">
                      Event Start Time
                    </FormLabel>
                    <FormControl>
                      <TimePicker value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        {/* tickets section */}
        <Card>
          <CardHeader>
            <CardTitle>Tickets Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex flex-wrap items-center gap-4">
                  {/* type */}
                  <FormField
                    control={form.control}
                    name={`tickets.${index}.type`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className={cn(index !== 0 && 'md:hidden')}>Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a ticket type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ticketType.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* price */}
                  <FormField
                    control={form.control}
                    name={`tickets.${index}.price`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className={cn(index !== 0 && 'md:hidden')}>Price</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 75.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* remove button */}
                  <div
                    className={cn('flex h-4', {
                      'md:-mt-5': index > 0,
                    })}
                  >
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => remove(index)}
                      disabled={fields.length <= 1}
                      className="cursor-pointer"
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {form.formState.errors.tickets && !form.formState.errors.tickets.root && (
                <p className="text-destructive text-sm font-medium">
                  {form.formState.errors.tickets.message}
                </p>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ type: 'General Admission', price: '0' })}
              className="w-full cursor-pointer md:w-fit"
            >
              <PlusCircleIcon className="mr-2 h-4 w-4" />
              Add Ticket Type
            </Button>
          </CardContent>
        </Card>
        {/* image upload options */}
        <Card>
          <CardHeader>
            <CardTitle>Event Images</CardTitle>
          </CardHeader>
          <CardContent>
            <FormItem>
              <FormControl>
                <div className="border-muted hover:border-primary relative rounded-lg border-2 border-dashed p-6 text-center transition-colors">
                  <UploadCloudIcon className="text-muted-foreground mx-auto h-12 w-12" />
                  <p className="text-muted-foreground mt-2 text-sm">
                    Drag & drop images here, or click to select files
                  </p>
                  <Input
                    type="file"
                    multiple
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                </div>
              </FormControl>
              <FormDescription>Upload one or more images for your event listing.</FormDescription>
              {imageStates.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {imageStates.map((state, idx) => (
                    <div className="group relative aspect-square" key={idx}>
                      {state.isLoading && (
                        <Skeleton className="flex h-full w-full items-center justify-center">
                          <Loader2Icon className="text-muted-foreground h-8 w-8 animate-spin" />
                        </Skeleton>
                      )}
                      <>
                        {state.url && (
                          <>
                            <Image
                              src={state.url}
                              alt={`Upload preview`}
                              fill
                              className="rounded-md border object-cover shadow-sm"
                              sizes="(min-width: 808px) 50vw, 100vw"
                              priority
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 z-10 h-6 w-6 cursor-pointer rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                              onClick={() => removeImage(state.id)}
                            >
                              <XCircleIcon className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </>
                    </div>
                  ))}
                </div>
              )}
            </FormItem>
          </CardContent>
        </Card>
        <Button type="submit" size="lg" className="w-full cursor-pointer" disabled={isPending}>
          {event
            ? isPending
              ? 'Updating..'
              : 'Update Event'
            : isPending
              ? 'Creating Event'
              : 'Create Event'}
        </Button>
      </form>
    </Form>
  );
};

export default EventForm;
