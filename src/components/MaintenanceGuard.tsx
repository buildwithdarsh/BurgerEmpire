'use client';
import { useConfig } from '@/hooks/useConfig';

export function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  const { config, isLoading } = useConfig();

  if (isLoading) return null;

  if (config?.system?.maintenance_mode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔧</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Under Maintenance</h1>
          <p className="text-gray-500">{config.system.maintenance_message || "We'll be back soon!"}</p>
        </div>
      </div>
    );
  }

  if (config?.system?.coming_soon) {
    const brandName = config?.branding?.name || 'We';
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🚀</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h1>
          <p className="text-gray-500">{brandName} &mdash; We&apos;re preparing something amazing! Stay tuned.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
