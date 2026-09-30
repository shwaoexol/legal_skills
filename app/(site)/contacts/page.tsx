export default function ContactsPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-navy-900">Контакты</h1>
      <ul className="mt-4 space-y-2 text-navy-700">
        <li>
          <a href="tel:+998778210877" className="hover:text-navy-900">+998 77 821 08 77</a>
        </li>
        <li>г. Ташкент, ул. Амира Темура, 12</li>
      </ul>
    </section>
  );
}