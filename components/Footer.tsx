import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-navy-900 text-white/70">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-semibold text-white">Legal Skills Academy</p>
            <p className="mt-2 text-sm">Образование. Навыки. Карьера.</p>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-white">Навигация</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/courses" className="hover:text-white">Курсы</Link></li>
              <li><Link href="/schedule" className="hover:text-white">Расписание</Link></li>
              <li><Link href="/teachers" className="hover:text-white">Преподаватели</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-white">Контакты</p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="tel:+998778210877" className="hover:text-white">+998 77 821 08 77</a>
              </li>
              <li>г. Ташкент</li>
            </ul>
          </div>
        </div>

        <p className="mt-8 border-t border-white/10 pt-6 text-xs">
          © {new Date().getFullYear()} Legal Skills Academy. Все права защищены.
        </p>
      </div>
    </footer>
  );
}