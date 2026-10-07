import Link from 'next/link';
import { MobileMenu } from '@/components/MobileMenu';

const NAV_LINKS = [
  { href: '/courses', label: 'Курсы' },
  { href: '/schedule', label: 'Расписание' },
  { href: '/teachers', label: 'Преподаватели' },
  { href: '/about', label: 'О центре' },
  { href: '/reviews', label: 'Отзывы' },
  { href: '/news', label: 'Новости' },
  { href: '/documents', label: 'Документы' },
  { href: '/contacts', label: 'Контакты' },
];

export function Header() {
  return (
    <header className="relative bg-navy-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="shrink-0 text-sm font-semibold leading-tight text-white">
          Legal Skills<br />Academy
        </Link>

        <nav className="hidden flex-wrap items-center gap-x-4 gap-y-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-xs text-white/80 hover:text-white xl:text-sm"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <a href="tel:+998778210877" className="hidden whitespace-nowrap text-sm text-white/80 2xl:block">
            +998 77 821 08 77
          </a>
          <Link
            href="/#apply"
            className="whitespace-nowrap rounded-md bg-gold-500 px-3 py-2 text-xs font-medium text-navy-900 hover:bg-gold-600 sm:px-4 sm:text-sm"
          >
            Оставить заявку
          </Link>
          <MobileMenu links={NAV_LINKS} />
        </div>
      </div>
    </header>
  );
}