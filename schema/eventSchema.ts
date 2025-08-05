import * as z from 'zod';

const ticketSchema = z.object({
  type: z.string().min(1, 'Please select a ticket type.'),
  price: z.string().refine(
    value => {
      const numValue = parseFloat(value);
      return numValue > 0 && numValue < 1000000;
    },
    {
      message: 'Price must be a positive number and less than 1,000,000.',
    },
  ),
});

export const eventSchema = z.object({
  title: z.string().nonempty('Title is required.').min(5, 'Title must be at least 5 characters.'),
  date: z.date({
    error: issue => (issue.input === undefined ? 'Date is required.' : 'Invalid date'),
  }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time (HH:MM).'),
  description: z
    .string()
    .nonempty('Description is required.')
    .min(10, 'Description must be at least 10 characters.'),
  venue: z.string().nonempty('Venue is required.').min(5, 'Venue must be at least 5 characters.'),
  categoryId: z.string().min(1, 'Please select at least one category.'),
  status: z.enum(['Draft', 'Published', 'Finished', 'Cancelled']),
  tickets: z.array(ticketSchema).min(1, 'You must add at least one ticket type.'),
  images: z.array(z.string()).min(1, 'Upload atleast 1 image.'),
  capacity: z.string().refine(
    value => {
      const numValue = parseFloat(value);
      return numValue > 0 && numValue < 10000;
    },
    {
      message: 'Capacity must be a positive number and less than 10,000.',
    },
  ),
});
