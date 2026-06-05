import AuthPanel from "./components/AuthPanel";
import type { FormEvent } from "react";
import type { AuthFormState } from "./types";
import ToastStack from "./components/ToastStack";

type AuthMode = "login" | "register";

interface AuthPanelProps {
    mode: AuthMode;
    form: AuthFormState;
    error: string;
    loading: boolean;
    onModeChange: (mode: AuthMode) => void;
    onChange: (value: Partial<AuthFormState>) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    toasts: any[]; // Replace 'any[]' with the actual type for your toasts
    onDismiss: (id: string) => void;
}

export default function Login({
    mode,
    form,
    error,
    loading,
    onModeChange,
    onChange,
    onSubmit,
    toasts,
    onDismiss: dismissToast
}: AuthPanelProps) {
    return (
        <div className="min-h-screen px-6 py-12 lg:px-16 relative bg-stone-50 overflow-hidden flex items-center justify-center">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-amber-200/40 blur-3xl" />
                <div className="absolute right-10 top-24 h-56 w-56 rounded-full bg-teal-200/30 blur-3xl" />
            </div>
            <div className="relative w-full max-w-5xl">
                <AuthPanel
                    mode={mode}
                    form={form}
                    error={error}
                    loading={loading}
                    onModeChange={onModeChange}
                    onChange={onChange}
                    onSubmit={onSubmit}
                />
            </div>
            <ToastStack toasts={toasts} onDismiss={dismissToast} />
        </div>
    );
}