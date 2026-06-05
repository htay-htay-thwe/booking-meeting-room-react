import type { FormEvent } from "react";
import type { AuthFormState } from "../types";

type AuthMode = "login" | "register";

interface AuthPanelProps {
  mode: AuthMode;
  form: AuthFormState;
  error: string;
  loading: boolean;
  onModeChange: (mode: AuthMode) => void;
  onChange: (value: Partial<AuthFormState>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function AuthPanel({
  mode,
  form,
  error,
  loading,
  onModeChange,
  onChange,
  onSubmit
}: AuthPanelProps) {
  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center animate-fade-up bg-white p-8 rounded-3xl border border-stone-200/80 shadow-xl">
      <div>
        <p className="inline-block bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
          Workspace Booking
        </p>
        <h1 className="mt-6 text-4xl font-extrabold leading-tight text-stone-900 md:text-5xl tracking-tight">
          Schedule rooms with clarity and flexibility.
        </h1>
        <p className="mt-4 text-base text-stone-500 max-w-md">
          Access shared scheduling interfaces instantly with internal role-based governance privileges.
        </p>
      </div>
      <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200/60">
        <div className="inline-flex rounded-xl bg-stone-200/60 p-1 w-full">
          <button
            type="button"
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
              mode === "login" ? "bg-white text-stone-900 shadow-sm" : "text-stone-600 hover:text-stone-900"
            }`}
            onClick={() => onModeChange("login")}
            disabled={loading}
          >
            Login
          </button>
          <button
            type="button"
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
              mode === "register" ? "bg-white text-stone-900 shadow-sm" : "text-stone-600 hover:text-stone-900"
            }`}
            onClick={() => onModeChange("register")}
            disabled={loading}
          >
            Register
          </button>
        </div>
        
        <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
          <label className="grid gap-1.5 text-sm font-semibold text-stone-700">
            Username
            <input
              placeholder="Enter username"
              className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-amber-500"
              value={form.name}
              onChange={(event) => onChange({ name: event.target.value })}
              required
            />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold text-stone-700">
            Password
            <input
              placeholder="Enter password"
              className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-amber-500"
              type="password"
              value={form.password || ""}
              onChange={(event) => onChange({ password: event.target.value })}
              required
            />
          </label>
          
          {error && <p className="text-sm font-semibold text-rose-600">{error}</p>}
          
          <button 
            className="w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold py-2.5 px-4 rounded-xl transition disabled:opacity-50 mt-2 shadow-sm" 
            type="submit" 
            disabled={loading}
          >
            {loading ? "Processing..." : mode === "login" ? "Log In" : "Create Account"}
          </button>
          
          <p className="text-xs text-stone-400 text-center mt-2 leading-relaxed">
            Seeded entries: <code className="bg-stone-200/50 text-stone-700 px-1 rounded">admin/admin123</code>
          </p>
        </form>
      </div>
    </div>
  );
}