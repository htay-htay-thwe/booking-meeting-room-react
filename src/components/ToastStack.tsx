type ToastKind = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  kind: ToastKind;
  message: string;
}

interface ToastStackProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

const kindStyles: Record<ToastKind, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  error: "border-rose-200 bg-rose-50 text-rose-900",
  info: "border-amber-200 bg-amber-50 text-amber-900"
};

export default function ToastStack({ toasts, onDismiss }: ToastStackProps) {
  return (
    <div className="fixed right-6 top-6 z-50 grid gap-3 max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center justify-between gap-4 rounded-2xl border p-4 text-sm font-semibold shadow-xl backdrop-blur-sm transition-all duration-300 animate-fade-in ${
            kindStyles[toast.kind]
          }`}
        >
          <span>{toast.message}</span>
          <button
            className="text-xs font-bold uppercase tracking-wider opacity-60 hover:opacity-100 transition whitespace-nowrap"
            type="button"
            onClick={() => onDismiss(toast.id)}
          >
            Close
          </button>
        </div>
      ))}
    </div>
  );
}