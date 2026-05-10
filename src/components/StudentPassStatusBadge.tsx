'use client';

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  PENDING: { bg: '#FEF3C7', text: '#92400E', label: 'Pending Verification' },
  VERIFIED: { bg: '#D1FAE5', text: '#065F46', label: 'Verified' },
  REJECTED: { bg: '#FEE2E2', text: '#991B1B', label: 'Rejected' },
  EXPIRED: { bg: '#F3F4F6', text: '#6B7280', label: 'Expired' },
  SUSPENDED: { bg: '#FEE2E2', text: '#991B1B', label: 'Suspended' },
};

interface StudentPassStatusBadgeProps {
  status: string;
}

export default function StudentPassStatusBadge({ status }: StudentPassStatusBadgeProps) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.PENDING;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: style.text }}
      />
      {style.label}
    </span>
  );
}
