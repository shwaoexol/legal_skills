import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TelegramButton } from '@/components/TelegramButton';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <TelegramButton />
    </>
  );
}