import type { FormEvent } from "react";
import type { BookingFormState } from "../types";

interface BookingFormCardProps {
  form: BookingFormState;
  error: string;
  loading: boolean;
  onChange: (value: Partial<BookingFormState>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function BookingFormCard({
  form,
  error,
  loading,
  onChange,
  onSubmit
}: BookingFormCardProps) {
  return (
    <div className="card bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm animate-fade-up">
      <h2 className="text-lg font-semibold text-stone-900">Create Booking</h2>
      <form className="mt-4 grid gap-4" onSubmit={onSubmit}>
        <label className="grid gap-2 text-sm font-semibold text-stone-700">
          Start Time
          <input
            className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-amber-500"
            type="datetime-local"
            value={form.startTime}
            onChange={(event) => onChange({ startTime: event.target.value })}
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-stone-700">
          End Time
          <input
            className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-amber-500"
            type="datetime-local"
            value={form.endTime}
            onChange={(event) => onChange({ endTime: event.target.value })}
            required
          />
        </label>
        {error && <p className="text-sm font-semibold text-rose-600">{error}</p>}
        <button 
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-xl transition disabled:opacity-50 shadow-sm mt-2" 
          type="submit" 
          disabled={loading}
        >
          {loading ? "Booking room..." : "Book the room"}
        </button>
      </form>
    </div>
  );
}