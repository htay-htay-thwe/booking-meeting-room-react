import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { apiFetch } from "./api";
import type {
    AuthFormState,
    Booking,
    BookingFormState,
    GroupedBookings,
    SummaryItem,
    User,
    UserFormState,
    UserRole
} from "./types";

import AuthPanel from "./components/AuthPanel";
import TopBar from "./components/TopBar";
import BookingFormCard from "./components/BookingFormCard";
import BookingListCard from "./components/BookingListCard";
import UserManagementCard from "./components/UserManagementCard";
import OwnerPanels from "./components/OwnerPanels";
import ToastStack, { type ToastMessage } from "./components/ToastStack";
import Sidebar from "./components/ui/Sidebar";

const emptyUser: User = { id: "", name: "", role: "user" };

function formatDate(value: string): string {
    if (!value) return "";
    return new Date(value).toLocaleString();
}

function readStoredUser(): User | null {
    const saved = localStorage.getItem("currentUser");
    if (!saved) return null;
    try {
        return JSON.parse(saved) as User;
    } catch {
        return null;
    }
}

export default function App() {
    const [user, setUser] = useState<User>(() => readStoredUser() ?? emptyUser);
    const [token, setToken] = useState<string>(() => localStorage.getItem("token") || "");
    const [authMode, setAuthMode] = useState<"login" | "register">("login");
    const [authForm, setAuthForm] = useState<AuthFormState>({ name: "", password: "" });
    const [authError, setAuthError] = useState<string>("");
    const [authLoading, setAuthLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(true);

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [bookingForm, setBookingForm] = useState<BookingFormState>({ startTime: "", endTime: "" });
    const [bookingError, setBookingError] = useState<string>("");
    const [bookingsLoading, setBookingsLoading] = useState(false);
    const [bookingSaving, setBookingSaving] = useState(false);
    const [bookingDeletingId, setBookingDeletingId] = useState<string | null>(null);

    const [users, setUsers] = useState<User[]>([]);
    const [userForm, setUserForm] = useState<UserFormState>({ name: "", password: "", role: "user" });
    const [userError, setUserError] = useState<string>("");
    const [usersLoading, setUsersLoading] = useState(false);
    const [userSaving, setUserSaving] = useState(false);
    const [userDeletingId, setUserDeletingId] = useState<string | null>(null);

    const [summary, setSummary] = useState<SummaryItem[]>([]);
    const [grouped, setGrouped] = useState<GroupedBookings[]>([]);
    const [ownerError, setOwnerError] = useState<string>("");
    const [ownerLoading, setOwnerLoading] = useState(false);

    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const isAuthed = Boolean(token);
    const isAdmin = user.role === "admin";
    const isOwner = user.role === "owner" || user.role === "admin";

    const canDelete = useMemo(() => {
        return new Set(
            bookings
                .filter((booking) => isOwner || booking.userId === user.id)
                .map((booking) => booking.id)
        );
    }, [bookings, isOwner, user.id]);

    const pushToast = useCallback((kind: ToastMessage["kind"], message: string) => {
        const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        setToasts((prev) => [...prev, { id, kind, message }]);
        window.setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 3500);
    }, []);

    const dismissToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const loadBookings = useCallback(async () => {
        setBookingsLoading(true);
        try {
            const data = await apiFetch<Booking[]>("/api/bookings", {}, token);
            setBookings(data);
        } catch (err) {
            setBookingError((err as Error).message);
        } finally {
            setBookingsLoading(false);
        }
    }, [token]);

    const loadUsers = useCallback(async () => {
        setUsersLoading(true);
        try {
            const data = await apiFetch<User[]>("/api/users", {}, token);
            setUsers(data);
        } catch (err) {
            setUserError((err as Error).message);
        } finally {
            setUsersLoading(false);
        }
    }, [token]);

    const loadOwnerData = useCallback(async () => {
        setOwnerLoading(true);
        try {
            const summaryData = await apiFetch<SummaryItem[]>("/api/owner/summary", {}, token);
            const groupedData = await apiFetch<GroupedBookings[]>("/api/owner/bookings-by-user", {}, token);
            setSummary(summaryData);
            setGrouped(groupedData);
        } catch (err) {
            setOwnerError((err as Error).message);
        } finally {
            setOwnerLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (!isAuthed) return;
        void loadBookings();
        if (isAdmin) void loadUsers();
        if (isOwner) void loadOwnerData();
    }, [isAuthed, isAdmin, isOwner, loadBookings, loadUsers, loadOwnerData]);

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
                pushToast("success", authMode === "login" ? "Welcome back." : "Account created.");
            } catch (err) {
                setAuthError((err as Error).message);
            } finally {
                setAuthLoading(false);
            }
        },
        [authForm, authMode, pushToast]
    );

    const handleLogout = useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        setToken("");
        setUser(emptyUser);
        setBookings([]);
        setUsers([]);
        setSummary([]);
        setGrouped([]);
    }, []);

    const handleCreateBooking = useCallback(
        async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setBookingError("");
            setBookingSaving(true);
            try {
                const payload = {
                    startTime: new Date(bookingForm.startTime).toISOString(),
                    endTime: new Date(bookingForm.endTime).toISOString()
                };
                await apiFetch("/api/bookings", { method: "POST", body: JSON.stringify(payload) }, token);
                setBookingForm({ startTime: "", endTime: "" });
                void loadBookings();
                if (isOwner) void loadOwnerData();
                pushToast("success", "Booking confirmed.");
            } catch (err) {
                setBookingError((err as Error).message);
            } finally {
                setBookingSaving(false);
            }
        },
        [bookingForm, isOwner, loadBookings, loadOwnerData, pushToast, token]
    );

    const handleDeleteBooking = useCallback(
        async (id: string) => {
            setBookingError("");
            setBookingDeletingId(id);
            try {
                await apiFetch(`/api/bookings/${id}`, { method: "DELETE" }, token);
                void loadBookings();
                if (isOwner) void loadOwnerData();
                pushToast("info", "Booking removed.");
            } catch (err) {
                setBookingError((err as Error).message);
            } finally {
                setBookingDeletingId(null);
            }
        },
        [isOwner, loadBookings, loadOwnerData, pushToast, token]
    );

    const handleCreateUser = useCallback(
        async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setUserError("");
            setUserSaving(true);
            try {
                await apiFetch("/api/users", { method: "POST", body: JSON.stringify(userForm) }, token);
                setUserForm({ name: "", password: "", role: "user" });
                void loadUsers();
                pushToast("success", "User created.");
            } catch (err) {
                setUserError((err as Error).message);
            } finally {
                setUserSaving(false);
            }
        },
        [loadUsers, pushToast, token, userForm]
    );

    const handleRoleChange = useCallback(
        async (id: string, role: User["role"]) => {
            setUserError("");
            setUserSaving(true);
            try {
                await apiFetch(`/api/users/${id}/role`, {
                    method: "PATCH",
                    body: JSON.stringify({ role })
                }, token);
                void loadUsers();
                pushToast("info", "Role updated.");
            } catch (err) {
                setUserError((err as Error).message);
            } finally {
                setUserSaving(false);
            }
        },
        [loadUsers, pushToast, token]
    );

    const handleDeleteUser = useCallback(
        async (id: string) => {
            setUserError("");
            setUserDeletingId(id);
            try {
                await apiFetch(`/api/users/${id}`, { method: "DELETE" }, token);
                void loadUsers();
                void loadBookings();
                if (isOwner) void loadOwnerData();
                pushToast("info", "User removed.");
            } catch (err) {
                setUserError((err as Error).message);
            } finally {
                setUserDeletingId(null);
            }
        },
        [isOwner, loadBookings, loadOwnerData, loadUsers, pushToast, token]
    );

    if (!isAuthed) {
        return (
            <div className="min-h-screen px-6 py-12 lg:px-16 relative bg-stone-50 overflow-hidden flex items-center justify-center">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-amber-200/40 blur-3xl" />
                    <div className="absolute right-10 top-24 h-56 w-56 rounded-full bg-teal-200/30 blur-3xl" />
                </div>
                <div className="relative w-full max-w-5xl">
                    <AuthPanel
                        mode={authMode}
                        form={authForm}
                        error={authError}
                        loading={authLoading}
                        onModeChange={setAuthMode}
                        onChange={(value) => setAuthForm((prev) => ({ ...prev, ...value }))}
                        onSubmit={handleAuthSubmit}
                    />
                </div>
                <ToastStack toasts={toasts} onDismiss={dismissToast} />
            </div>
        );
    }

    return (
        <BrowserRouter>
            <div className="flex h-screen bg-stone-100 overflow-hidden">
                <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} userRole={user.role} />

                <main className="flex-1 overflow-y-auto p-7">
                    <TopBar user={user} onLogout={handleLogout} />

                    <div className="mt-8">
                        <Routes>
                            <Route path="/dashboard" element={
                                <section className="grid gap-5">
                                    {((user.role === "user" || user.role === "owner") && (
                                        <BookingFormCard
                                            form={bookingForm}
                                            onChange={(v) => setBookingForm(p => ({ ...p, ...v }))}
                                            onSubmit={handleCreateBooking}
                                            error={bookingError}
                                            loading={bookingSaving}
                                        />
                                    ))}
                                    <BookingListCard
                                        bookings={bookings}
                                        onDelete={handleDeleteBooking}
                                        loading={bookingsLoading}
                                        canDelete={canDelete}
                                        deletingId={bookingDeletingId}
                                        formatDate={formatDate}
                                    />
                                </section>
                            } />

                            {isAdmin && (
                                <Route path="/users" element={
                                    <UserManagementCard
                                        users={users}
                                        user={user}
                                        form={userForm}
                                        onFormChange={(v) => setUserForm(p => ({ ...p, ...v }))}
                                        onCreate={handleCreateUser}
                                        onDelete={handleDeleteUser}
                                        handleRoleChange={handleRoleChange}
                                        error={userError}
                                        loading={usersLoading}
                                        saving={userSaving}
                                        deletingId={userDeletingId}
                                    />
                                } />
                            )}

                            {isOwner && (
                                <Route path="/booking-list" element={
                                    <OwnerPanels
                                        summary={summary}
                                        grouped={grouped}
                                        error={ownerError}
                                        loading={ownerLoading}
                                        formatDate={formatDate}
                                    />
                                } />
                            )}

                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                    </div>
                </main>
                <ToastStack toasts={toasts} onDismiss={dismissToast} />
            </div>
        </BrowserRouter>
    );
}