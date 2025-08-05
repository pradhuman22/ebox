'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Search, Ticket, ShieldCheck, PenSquare, DollarSign, Users } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function HowItWorksPage() {
  const buyerSteps = [
    {
      icon: Search,
      title: 'Find Event',
      description:
        'Browse or search thousands of events. Use filters to find the perfect one for you.',
    },
    {
      icon: Ticket,
      title: 'Purchase Securely',
      description:
        'Choose your tickets and complete your purchase through our secure payment gateway.',
    },
    {
      icon: ShieldCheck,
      title: 'Enjoy the Show',
      description:
        'Receive your verified ticket instantly. Just show it at the event and have a great time!',
    },
  ];

  const sellerSteps = [
    {
      icon: PenSquare,
      title: 'List Your Event',
      description: 'Easily create a listing for your event. Set your ticket types and prices.',
    },
    {
      icon: Users,
      title: 'Reach Buyers',
      description:
        'Your listing is instantly available to a huge audience of potential ticket buyers.',
    },
    {
      icon: DollarSign,
      title: 'Get Paid',
      description: `Once your event is over, funds are transferred securely to your account. It's that simple.`,
    },
  ];

  const faqs = [
    {
      question: 'Is it safe to buy tickets on ebox?',
      answer:
        'Yes! All tickets are verified for authenticity, and our secure payment system protects your financial information. We offer a 100% buyer guarantee.',
    },
    {
      question: 'What are the fees for selling tickets?',
      answer: `We believe in transparency. We charge a small, flat service fee upon a successful sale. There are no hidden charges. You see the final amount you'll receive before you list.`,
    },
    { question: 'How do I receive my tickets after purchase?', answer: 'howItWorks.faq3Answer' },
    {
      question: 'Can I get a refund if the event is cancelled?',
      answer: `Absolutely. If an event is cancelled, you will automatically receive a full refund, including all service fees. If it's postponed, your ticket will be valid for the new date.`,
    },
  ];
  return (
    <div className="container mx-auto max-w-screen-xl px-4 py-12 md:px-16 md:py-10">
      <div className="mb-16 text-center">
        <h1 className="font-headline text-primary text-4xl font-bold md:text-5xl">How It Works?</h1>
        <p className="text-muted-foreground mx-auto mt-3 max-w-2xl">
          A simple, secure and fair marketplace for buying and selling tickets
        </p>
      </div>

      <div className="grid gap-16 md:grid-cols-2">
        <section id="buyers">
          <h2 className="font-headline mb-8 text-center text-3xl font-bold">For Buyers</h2>
          <div className="space-y-8">
            {buyerSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full">
                    <step.icon className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="sellers">
          <h2 className="font-headline mb-8 text-center text-3xl font-bold">For Sellers</h2>
          <div className="space-y-8">
            {sellerSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="bg-accent text-accent-foreground flex h-12 w-12 items-center justify-center rounded-full">
                    <step.icon className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Separator className="my-16" />

      <section id="faq">
        <h2 className="font-headline mb-12 text-3xl font-bold">Frequently Asked Questions</h2>
        <div className="">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
