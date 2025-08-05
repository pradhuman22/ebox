import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
  Link,
} from '@react-email/components'

export const EmailVerification = (url: string, username: string) => {
  return (
    <Html>
      <Head />
      <Preview>Verify Your Email for Habito</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto max-w-lg rounded-lg bg-white p-6 shadow-md">
            <Section className="mb-4">
              <Text className="text-xl font-semibold text-gray-800">
                Hi {username},
              </Text>
            </Section>
            <Section className="mb-6">
              <Text className="text-base leading-relaxed text-gray-700">
                Thank you for signing up with habito! To complete your
                registration and start using our services, please verify your
                email by clicking the link below:
              </Text>
            </Section>
            <Section className="text-center">
              <Link
                href={url}
                target="_blank"
                className="inline-block rounded-lg bg-zinc-600 px-4 py-2 font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-700"
              >
                Verify Email Address
              </Link>
            </Section>
            <Section className="mt-6">
              <Text className="text-base leading-relaxed text-gray-700">
                If the button above doesn’t work, you can copy and paste the
                following link into your browser:
              </Text>
              <Text className="mt-2 text-sm break-words text-blue-500">
                {url}
              </Text>
            </Section>
            <Section className="mt-6">
              <Text className="text-base text-gray-700">
                If you didn’t request this email, there’s nothing to worry
                about; you can safely ignore it.
              </Text>
            </Section>
            <Section className="mt-6 text-center text-sm text-gray-500">
              <Text>
                Need help? Contact us at{' '}
                <Link
                  href="mailto:support@event-box.com"
                  className="text-blue-500"
                >
                  support@habito.com
                </Link>
                .
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
