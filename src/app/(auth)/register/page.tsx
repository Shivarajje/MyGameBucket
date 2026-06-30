import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account | MyGameBucket',
  description: 'Create a new MyGameBucket account',
};

export default function RegisterPage() {
  return (
    <main className="flex-1 flex flex-col">
      <Container className="flex-1 flex flex-col items-center justify-center py-10">
        <Section className="w-full">
          <RegisterForm />
        </Section>
      </Container>
    </main>
  );
}
