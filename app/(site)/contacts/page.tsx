import { BannerPage } from "@/components/BannerPage";

const LAT = 41.3287;
const LNG = 69.2824;
const ADDRESS = "г. Ташкент, рядом с метро «Минор»";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Контакты",
  description: "Адрес, телефон, Telegram и Instagram учебного центра Legal Skills Academy.",
};


export default function ContactsPage() {
  return (
    <div>
      <BannerPage title="Контакты" subtitle="Свяжитесь с нами удобным способом" />

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <ul className="space-y-3 text-navy-700">
              <li>
                <span className="font-medium text-navy-900">Телефон: </span>
                <a href="tel:+998778210877" className="hover:text-gold-600">+998 77 821 08 77</a>
              </li>
              <li>
                <span className="font-medium text-navy-900">Telegram: </span>
                <a
                  href="https://t.me/legalskills_academy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-600"
                >
                  @legalskills_academy
                </a>
              </li>
              <li>
                <span className="font-medium text-navy-900">Instagram: </span>
                <a
                  href="https://www.instagram.com/legal_skillsacademy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-600"
                >
                  @legal_skillsacademy
                </a>
              </li>
              <li>
                <span className="font-medium text-navy-900">Мафтуна</span> — методист
              </li>
              <li>
                <span className="font-medium text-navy-900">Адрес: </span>{ADDRESS}
              </li>
              <li>
                <span className="font-medium text-navy-900">Режим работы: </span>
                Пн–Сб, 9:00–19:00
              </li>
            </ul>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${LAT},${LNG}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-md bg-gold-500 px-5 py-2.5 text-sm font-medium text-navy-900 hover:bg-gold-600"
            >
              Построить маршрут
            </a>
          </div>

          <div className="overflow-hidden rounded-lg border border-navy-900/10">
            <iframe
              title="Карта расположения Legal Skills Academy"
              src={`https://www.google.com/maps?q=${LAT},${LNG}&z=15&output=embed`}
              width="100%"
              height="320"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
}