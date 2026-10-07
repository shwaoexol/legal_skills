import { BannerPage } from "@/components/BannerPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "О центре",
  description: "Legal Skills Academy — учебный центр, который готовит специалистов в области права, языка, бухгалтерии, HR и психологии.",
};

export default function AboutPage() {
  return (
    <div>
      <BannerPage
        title="О центре"
        subtitle="Legal Skills Academy — образование, которое открывает новые возможности"
      />

      <section className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-navy-700">
          Legal Skills Academy — учебный центр, который готовит специалистов в области права,
          языка, бухгалтерии, HR и психологии. Мы объединяем практикующих экспертов и
          современную методику обучения, чтобы студенты получали не только теорию, но и
          применимые на практике навыки.
        </p>
        <p className="mt-4 text-navy-700">
          Наши курсы подходят как тем, кто делает первые шаги в профессии, так и тем, кто
          хочет повысить квалификацию в уже знакомой области.
        </p>
      </section>
    </div>
  );
}