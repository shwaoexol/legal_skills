import Link from 'next/link';

const NAV_LINKS = [
  { href: '/courses', label: 'Курсы' },
  { href: '/schedule', label: 'Расписание' },
  { href: '/teachers', label: 'Преподаватели' },
  { href: '/about', label: 'О центре' },
  { href: '/reviews', label: 'Отзывы' },
  { href: '/news', label: 'Новости' },
  { href: '/contacts', label: 'Контакты' },
];

export function Header() {
  return (
    <header className="bg-navy-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-sm font-semibold leading-tight text-white">
          Legal Skills<br />Academy
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-white/80 hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a href="tel:+998778210877" className="hidden text-sm text-white/80 md:block">
            +998 77 821 08 77
          </a>
          <Link href="/#apply" className="rounded-md bg-gold-500 px-4 py-2 text-sm font-medium text-navy-900 hover:bg-gold-600">
            Оставить заявку
          </Link>
        </div>
      </div>
    </header>
  );
}