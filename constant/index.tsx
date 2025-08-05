import {
  BriefcaseBusinessIcon,
  CheckCircleIcon,
  CircleOffIcon,
  GamepadIcon,
  HeartPulseIcon,
  HelpCircleIcon,
  MusicIcon,
  PartyPopperIcon,
  PizzaIcon,
} from 'lucide-react';

export const navigationLinks = [
  { label: 'Browse Events', url: '/events' },
  { label: 'How It Works', url: '/how-it-works' },
  { label: 'Contact Us', url: '/contact-us' },
];

export const footerLinks = [
  {
    title: 'Quick',
    links: [
      { label: 'Browse Events', url: '/events' },
      { label: 'Host Event', url: '/dashboard/events/create' },
      { label: 'Terms of Service', url: '/terms-of-service' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'How It Works', url: '/how-it-works' },
      { label: 'Help Center', url: '/contact-us' },
      { label: 'FAQ', url: '/how-it-works?#faq' },
    ],
  },
];

export const ticketType = [
  { value: 'general', label: 'General' },
  { value: 'premium', label: 'Premium' },
  { value: 'vip', label: 'VIP' },
];

export const statuses = [
  {
    value: 'Draft',
    label: 'Draft',
    icon: HelpCircleIcon,
  },
  {
    value: 'Published',
    label: 'Published',
    icon: CheckCircleIcon,
  },
  {
    value: 'Cancelled',
    label: 'Cancelled',
    icon: CircleOffIcon,
  },
];

export const categories = [
  {
    label: 'Music',
    value: 'music',
    icon: MusicIcon,
  },
  {
    label: 'Business',
    value: 'business',
    icon: BriefcaseBusinessIcon,
  },
  {
    label: 'Festivals',
    value: 'festivals',
    icon: PartyPopperIcon,
  },
  {
    label: 'Food & Drink',
    value: 'food-drink',
    icon: PizzaIcon,
  },
  {
    label: 'Hobbies',
    value: 'hobbies',
    icon: GamepadIcon,
  },
  {
    label: 'Health & Wellness',
    value: 'health-wellness',
    icon: HeartPulseIcon,
  },
];
