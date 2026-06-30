import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password | MyGameBucket',
  description: 'Reset your MyGameBucket password',
};

export default function ResetPasswordPage() {
  return (
    <main className="flex-1 flex flex-col">
      <Container className="flex-1 flex flex-col items-center justify-center py-10">
        <Section className="w-full">
          <ResetPasswordForm />
        </Section>
      </Container>
    </main>
  );
}
