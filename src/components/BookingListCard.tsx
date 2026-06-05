import type { Booking } from "../types";

interface BookingListCardProps {
  bookings: Booking[];
  loading: boolean;
  canDelete: Set<string>;
  deletingId: string | null;
  onDelete: (id: string) => Promise<void>;
  formatDate: (value: string) => string;
}

export default function BookingListCard({
  bookings,
  loading,
  canDelete,
  deletingId,
  onDelete,
  formatDate
}: BookingListCardProps) {

  const handleDelete = async (
    id: string,

  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this booking?`
    );

    if (!confirmed) return;

    try {
      await onDelete(id);
    } catch (error) {
      console.error(error);
      alert("Failed to delete booking.");
    }
  };

  return (
    <div className="card bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm lg:col-span-2 animate-fade-up">
      <h2 className="text-lg font-semibold text-stone-900">
        Room Bookings
      </h2>

      <div className="mt-4 grid gap-3 max-h-[500px] overflow-y-auto pr-1">
        {loading && (
          <div className="grid gap-3 animate-pulse">
            <div className="h-14 w-full bg-stone-100 rounded-xl" />
            <div className="h-14 w-full bg-stone-100 rounded-xl" />
          </div>
        )}

        {!loading && bookings.length === 0 && (
          <p className="text-sm text-stone-500 py-4 text-center">
            No bookings yet. Create the first slot!
          </p>
        )}

        {!loading &&
          bookings.map((booking, index) => (
            <div
              key={index}
              className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 mb-3 rounded-2xl border border-stone-100 bg-white shadow-sm hover:shadow-md hover:border-stone-200/80 transition-all duration-200 ease-out"
            >
              {/* Left Accent */}
              <div className="absolute left-0 top-1/4 h-1/2 w-1 rounded-r-full bg-stone-300 group-hover:bg-amber-500 transition-colors duration-200" />

              {/* Booking Info */}
              <div className="flex items-start gap-3 pl-2 min-w-0 flex-1">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-50 border border-stone-100 text-stone-600 font-bold text-sm tracking-tight shadow-sm group-hover:bg-amber-50 group-hover:text-amber-700 transition-colors duration-200">
                  {(booking.userName || "U")
                    .substring(0, 2)
                    .toUpperCase()}
                </div>

                <div className="space-y-1 min-w-0">
                  <h4 className="text-sm font-semibold text-stone-800 tracking-tight truncate">
                    {booking.userName || "Unknown User"}
                  </h4>

                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-500">
                    <svg
                      className="h-3.5 w-3.5 text-stone-400 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>

                    <time className="font-medium text-stone-600">
                      {formatDate(booking.startTime)}
                    </time>

                    <span className="text-stone-300">to</span>

                    <time className="font-medium text-stone-600">
                      {formatDate(booking.endTime)}
                    </time>
                  </div>
                </div>
              </div>

              {/* Delete Button */}
              <div className="flex items-center justify-end sm:pl-0 pl-12">
                <button
                  type="button"
                  disabled={deletingId === booking._id}
                  onClick={() =>
                    handleDelete(
                      booking._id,
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-stone-600 border border-stone-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all duration-150"
                >
                  {deletingId === booking._id
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}