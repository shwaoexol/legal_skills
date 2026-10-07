import type { Metadata } from "next";
import "./globals.css";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["cyrillic", "latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    default: "Legal Skills Academy",
    template: "%s | Legal Skills Academy",
  },
  description: "Учебный центр: право, английский язык для юристов, бухгалтерия, HR, психология. 9 направлений обучения в Ташкенте.",
  openGraph: {
    title: "Legal Skills Academy",
    description: "Учебный центр: право, английский язык для юристов, бухгалтерия, HR, психология.",
    locale: "ru_RU",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={montserrat.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}