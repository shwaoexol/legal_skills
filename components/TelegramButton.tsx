export function TelegramButton() {
  return (
    <a
      href="https://t.me/legalskills_academy"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Написать в Telegram"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#229ED9] text-white shadow-lg transition-transform hover:scale-105"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
        <path d="M21.73 2.27a1 1 0 0 0-1.05-.2L2.4 9.37a1 1 0 0 0 .07 1.87l4.72 1.64 1.8 5.78a1 1 0 0 0 1.72.35l2.52-2.8 4.6 3.4a1 1 0 0 0 1.58-.58l3.5-15.1a1 1 0 0 0-.18-.66ZM9.9 13.98l-1.1 3.52-1.1-3.54 9.9-6.2-7.7 6.22Z" />
      </svg>
    </a>
  );
}