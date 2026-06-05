import type { User } from "../types";

interface TopBarProps {
  user: User;
  onLogout: () => void;
}

export default function TopBar({ user, onLogout }: TopBarProps) {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between animate-fade-up">
      <div>
        <p className="inline-block bg-stone-200/60 text-stone-700 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
          Dashboard Panel
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">Welcome back, {user.name}</h1>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="rounded-xl bg-amber-100/80 px-4 py-2 text-sm font-semibold text-amber-800 border border-amber-200/40 capitalize">
          Role: {user.role}
        </div>
        <button 
          className="text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-200/50 px-4 py-2 rounded-xl transition font-medium" 
          type="button" 
          onClick={onLogout}
        >
          Log out
        </button>
      </div>
    </header>
  );
}