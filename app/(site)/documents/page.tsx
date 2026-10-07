import { prisma } from "@/lib/db";
import { BannerPage } from "@/components/BannerPage";

const TYPE_LABELS: Record<string, string> = {
  OFFER: 'Публичная оферта',
  PRIVACY_POLICY: 'Политика персональных данных',
  CONSENT: 'Согласие на обработку персональных данных',
  REQUISITES: 'Реквизиты организации',
  OTHER: 'Документ',
};

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Документы",
  description: "Публичная оферта, политика персональных данных и другие документы Legal Skills Academy.",
};


export default async function DocumentsPage() {
  const documents = await prisma.legalDocument.findMany({ orderBy: { publishedAt: 'desc' } });

  return (
    <div>
      <BannerPage title="Документы" subtitle="Публичная оферта, политика персональных данных и другие официальные документы" />

      <section className="mx-auto max-w-3xl px-6 py-10">
        {documents.length === 0 ? (
          <p className="text-navy-700/60">Документы пока не опубликованы.</p>
        ) : (
          <ul className="space-y-3">
            {documents.map((doc) => (
              <li key={doc.id} className="flex items-center justify-between rounded-lg border border-navy-900/10 p-4">
                <div>
                  <p className="font-medium text-navy-900">{doc.title}</p>
                  <p className="text-xs text-navy-700/60">
                    {TYPE_LABELS[doc.type]} · версия {doc.version} · от {new Date(doc.publishedAt).toLocaleDateString('ru-RU')}
                  </p>
                </div>
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-gold-500 px-4 py-2 text-sm font-medium text-navy-900 hover:bg-gold-600"
                >
                  Открыть
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}