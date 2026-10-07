export async function notifyNewApplication(data: {
  name: string;
  phone: string;
  telegram?: string | null;
  courseTitle?: string;
  format?: string;
  preferredTime?: string | null;
  comment?: string | null;
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  console.log('TOKEN:', token ? 'есть' : 'ПУСТО', 'CHAT_ID:', chatId ? 'есть' : 'ПУСТО');

  if (!token || !chatId) return;

  const lines = [
    '📩 Новая заявка с сайта',
    `Имя: ${data.name}`,
    `Телефон: ${data.phone}`,
    data.telegram ? `Telegram: ${data.telegram}` : null,
    data.courseTitle ? `Курс: ${data.courseTitle}` : null,
    data.format ? `Формат: ${data.format}` : null,
    data.preferredTime ? `Удобное время: ${data.preferredTime}` : null,
    data.comment ? `Комментарий: ${data.comment}` : null,
  ].filter(Boolean);

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: lines.join('\n') }),
  });

  const result = await res.json();
  console.log('TELEGRAM API RESPONSE:', JSON.stringify(result));
}