import type { GroupedBookings, SummaryItem } from "../types";

interface OwnerPanelsProps {
  summary: SummaryItem[];
  grouped: GroupedBookings[];
  error: string;
  loading: boolean;
  formatDate: (value: string) => string;
}

export default function OwnerPanels({
  summary,
  grouped,
  error,
  loading,
  formatDate
}: OwnerPanelsProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-2 animate-fade-up">
      <div className="card">
        <h2 className="text-lg font-semibold text-stone-900">Usage Summary</h2>
        {error && <p className="mt-3 text-sm font-semibold text-rose-600">{error}</p>}
        <div className="mt-4 grid gap-3">
          {loading && (
            <div className="grid gap-3">
              <div className="skeleton h-12 w-full" />
              <div className="skeleton h-12 w-full" />
              <div className="skeleton h-12 w-full" />
            </div>
          )}
          {!loading &&
            summary.map((item, index) => (
              <div
                key={index} // Preferred unique string ID over index if available
                className="flex items-center justify-between border-b border-stone-100 pb-3"
              >
                <div>
                  <p className="font-semibold text-stone-800">{item.name}</p>
                  <p className="text-sm text-stone-500">{item.role}</p>
                </div>
                <span className="text-lg font-semibold text-stone-800">
                  {item.totalBookings}
                </span>
              </div>
            ))}

          {!loading && summary.length === 0 && (
            <p className="text-sm text-stone-500 py-4 text-center">
              No usage data available.
            </p>
          )}
        </div>
      </div>
      <div className="card col-span-full">
        <h2 className="text-lg font-semibold text-stone-900">Bookings by User</h2>
        <div className="mt-4 grid gap-4">
          {loading && (
            <div className="grid gap-3">
              <div className="skeleton h-16 w-full" />
              <div className="skeleton h-16 w-full" />
            </div>
          )}
          {!loading &&
            grouped.map((item, index) => (
              <div
                key={index}
                className="border-b border-dashed border-stone-200 pb-3"
              >
                <p className="text-sm font-semibold text-stone-700">
                  {item.name} ({item.role})
                </p>
                {item.bookings.length === 0 && (
                  <p className="text-sm text-stone-500">No bookings.</p>
                )}
                {item.bookings.map((booking, bIndex) => (
                  <p
                    // FIX: Fallback chain ensures a unique key value is always found
                    key={bIndex}
                    className="text-sm text-stone-600"
                  >
                    {formatDate(booking.startTime)} to {formatDate(booking.endTime)}
                  </p>
                ))}
              </div>
            ))}

          {!loading && grouped.length === 0 && (
            <p className="text-sm text-stone-500 py-4 text-center">
              No booking data available.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}