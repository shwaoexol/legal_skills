import type { Metadata } from "next";
import "./globals.css";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["cyrillic", "latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Legal Skills Academy",
  description: "Учебный центр",
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