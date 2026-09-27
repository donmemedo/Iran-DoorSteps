export function Logo({ size = 34 }: { size?: number }) {
  return (
    <span className="grad-brand grid shrink-0 place-items-center rounded-2xl shadow-soft"
      style={{ width: size, height: size }} aria-hidden>
      <svg viewBox="0 0 24 24" width={size * 0.62} height={size * 0.62} fill="none" stroke="#fff"
        strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5.5 9.7V20h13V9.7" />
        <path d="M10 20v-5.2h4V20" />
      </svg>
    </span>
  );
}
