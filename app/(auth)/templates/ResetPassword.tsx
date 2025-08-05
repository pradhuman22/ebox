import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface ResetPasswordEmailProps {
  name?: string
  url?: string
}

const ResetPassword = ({ name, url }: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Password reset request for your habito account</Preview>
      <Tailwind>
        <Body className="bg-background px-4 py-6 font-sans">
          <Container className="bg-background border-muted-foreground mx-auto max-w-lg rounded-lg border p-6 shadow-md">
            <Section className="mb-4">
              <Text className="text-muted-foreground text-lg font-semibold">
                Hi {name},
              </Text>
            </Section>
            <Section className="mb-6">
              <Text className="text-muted-foreground text-base">
                We received a request to reset the password for your habito
                account. If you made this request, please click the button below
                to reset your password:
              </Text>
            </Section>
            <Section className="mb-6 text-center">
              <Button
                className="rounded-md bg-zinc-700 px-6 py-3 text-base font-medium text-zinc-50"
                href={url}
              >
                Reset Password
              </Button>
            </Section>
            <Section className="mb-6">
              <Text className="text-muted-foreground text-base">
                If you didn’t request to reset your password, no action is
                required. You can safely ignore this email.
              </Text>
            </Section>
            <Section>
              <Text className="text-muted-foreground text-sm">
                To ensure the security of your account, please do not forward
                this email or share the reset link with anyone.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default ResetPassword
