import { LoginForm } from '@/features/auth/components/LoginForm';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Log in | MyGameBucket',
  description: 'Log in to your MyGameBucket account',
};

export default function LoginPage() {
  return (
    <main className="flex-1 flex flex-col">
      <Container className="flex-1 flex flex-col items-center justify-center py-10">
        <Section className="w-full">
          <LoginForm />
        </Section>
      </Container>
    </main>
  );
}
