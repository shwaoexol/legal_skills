'use client';

import { useState } from 'react';

export function ApplicationForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');

    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get('name'),
      phone: form.get('phone'),
      website: form.get('website'),
    };

    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setStatus(res.ok ? 'success' : 'error');
  }

  if (status === 'success') {
    return <p>Заявка отправлена!</p>;
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
      {status === 'error' && <p className="text-sm text-red-600">Не удалось отправить, попробуйте ещё раз</p>}
      <button type="submit" disabled={status === 'loading'} className="rounded bg-black px-4 py-2 text-white">
        {status === 'loading' ? 'Отправка…' : 'Отправить'}
      </button>
    </form>
  );
}