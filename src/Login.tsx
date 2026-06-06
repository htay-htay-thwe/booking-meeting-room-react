import AuthPanel from "./components/AuthPanel";
import { useCallback, type FormEvent } from "react";
import type { AuthFormState, User } from "./types";
import ToastStack from "./components/ToastStack";
import { apiFetch } from "./api";
import { useNavigate } from "react-router-dom";

type AuthMode = "login" | "register";

interface AuthPanelProps {
    mode: AuthMode;
    form: AuthFormState;
    error: string;
    loading: boolean;
    onModeChange: (mode: AuthMode) => void;
    onChange: (value: Partial<AuthFormState>) => void;
    toasts: any[]; // Replace 'any[]' with the actual type for your toasts
    onDismiss: (id: string) => void;
    setAuthError: (error: string) => void;
    setAuthLoading: (loading: boolean) => void;
    setToken: (token: string) => void;
    setUser: (user: User) => void;
    setAuthForm: (form: AuthFormState) => void;
    authMode: AuthMode;
    authForm: AuthFormState;
    pushToast: (type: "success" | "error", message: string) => void;
}

export default function Login({
    mode,
    form,
    error,
    loading,
    onModeChange,
    onChange,
    toasts,
    onDismiss: dismissToast,
    setAuthError,
    setAuthLoading,
    setToken,
    setUser,
    setAuthForm,
    authMode,
    authForm,
    pushToast

}: AuthPanelProps) {
    const navigate = useNavigate();
    const handleAuthSubmit = useCallback(
        async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setAuthError("");
            setAuthLoading(true);
            const endpoint = authMode === "login" ? "/api/auth/login" : "/api/auth/register";
            try {
                const data = await apiFetch<{ token: string; user: User }>(endpoint, {
                    method: "POST",
                    body: JSON.stringify(authForm)
                });
                localStorage.setItem("token", data.token);
                localStorage.setItem("currentUser", JSON.stringify(data.user));
                setToken(data.token);
                setUser(data.user);
                setAuthForm({ name: "", password: "" });
                navigate('/dashboard');
                pushToast("success", authMode === "login" ? "Welcome back." : "Account created.");
            } catch (err) {
                setAuthError((err as Error).message);
            } finally {
                setAuthLoading(false);
            }
        },
        [authForm, authMode, pushToast]
    );

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
                    onSubmit={handleAuthSubmit}
                />
            </div>
            <ToastStack toasts={toasts} onDismiss={dismissToast} />
        </div>
    );
}