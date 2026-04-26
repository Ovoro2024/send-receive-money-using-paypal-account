type Props = { className?: string };

// Two-tone PayPal "P" mark
export function PayPalLogo({ className }: Props) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      {/* Back P (lighter) */}
      <path
        fill="#469BDB"
        d="M9.5 4h9.1c4.6 0 7.4 2.4 6.7 6.9-.7 4.7-4 7.4-8.6 7.4h-3.3c-.6 0-1.1.4-1.2 1l-1.2 7.5c-.1.5-.5.8-1 .8H6.6c-.4 0-.7-.4-.6-.8L8.5 4.8c.1-.5.5-.8 1-.8z"
      />
      {/* Front P (darker) */}
      <path
        fill="#1B3D8F"
        d="M12.5 7h9.1c4.6 0 7.4 2.4 6.7 6.9-.7 4.7-4 7.4-8.6 7.4h-3.3c-.6 0-1.1.4-1.2 1L14 29.8c-.1.5-.5.8-1 .8H9.6c-.4 0-.7-.4-.6-.8l2.5-22.2c.1-.5.5-.8 1-.8z"
      />
    </svg>
  );
}
