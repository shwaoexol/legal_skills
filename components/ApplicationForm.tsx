'use client';

import { useState } from 'react';

type Props = {
  courses?: { id: string; title: string }[];
  defaultCourseId?: string;
};

export function ApplicationForm({ courses, defaultCourseId }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get('name'),
      phone: form.get('phone'),
      telegram: form.get('telegram') || undefined,
      courseId: defaultCourseId ?? (form.get('courseId') || null),
      format: form.get('format') || undefined,
      preferredTime: form.get('preferredTime') || undefined,
      comment: form.get('comment') || undefined,
      consentPersonalData: form.get('consent') === 'on',
      website: form.get('website'),
    };

    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setStatus('success');
    } else {
      const data = await res.json().catch(() => null);
      setErrorMsg(data?.error ?? 'Не удалось отправить, попробуйте ещё раз');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return <p className="text-navy-900">Спасибо! Заявка отправлена, мы свяжемся с вами в ближайшее время.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px]"
      />

      <input name="name" placeholder="Имя" required className="block w-full rounded border p-2" />
      <input name="phone" placeholder="Телефон" required className="block w-full rounded border p-2" />
      <input name="telegram" placeholder="Telegram (необязательно)" className="block w-full rounded border p-2" />

      {courses && courses.length > 0 && !defaultCourseId && (
        <select name="courseId" className="block w-full rounded border p-2">
          <option value="">Выберите курс</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      )}

      <select name="format" className="block w-full rounded border p-2">
        <option value="">Формат обучения</option>
        <option value="ONLINE">Онлайн</option>
        <option value="OFFLINE">Офлайн</option>
        <option value="HYBRID">Онлайн + Офлайн</option>
      </select>

      <input name="preferredTime" placeholder="Удобное время для звонка" className="block w-full rounded border p-2" />
      <textarea name="comment" placeholder="Комментарий" rows={3} className="block w-full rounded border p-2" />

      <label className="flex items-start gap-2 text-sm text-navy-700">
        <input type="checkbox" name="consent" required className="mt-1" />
        Согласен(на) на обработку персональных данных
      </label>

      {status === 'error' && <p className="text-sm text-red-600">{errorMsg}</p>}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="rounded bg-gold-500 px-4 py-2 font-medium text-navy-900 hover:bg-gold-600"
      >
        {status === 'loading' ? 'Отправка…' : 'Отправить заявку'}
      </button>
    </form>
  );
}