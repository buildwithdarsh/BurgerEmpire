'use client';

export default function WhatsAppOrderButton() {
  return (
    <a
      href="mailto:hello@build.withdarsh.com?subject=Order%20Inquiry"
      aria-label="Contact us to order"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-amber-600 px-4 py-3 text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
    >
      {/* Mail icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 shrink-0"
        aria-hidden="true"
      >
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
      <span className="text-sm font-semibold leading-none">Contact to Order</span>
    </a>
  );
}
