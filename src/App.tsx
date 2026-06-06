import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { apiFetch } from "./api";
import type {
    AuthFormState,
    Booking,
    BookingFormState,
    GroupedBookings,
    SummaryItem,
    User,
    UserFormState,
} from "./types";

import TopBar from "./components/TopBar";
import BookingFormCard from "./components/BookingFormCard";
import BookingListCard from "./components/BookingListCard";
import UserManagementCard from "./components/UserManagementCard";
import OwnerPanels from "./components/OwnerPanels";
import ToastStack, { type ToastMessage } from "./components/ToastStack";
import Sidebar from "./components/ui/Sidebar";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import DashboardLayout from "./components/ui/DashboardLayout";
import PublicRoute from "./PublicRoute";

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
                .map((booking) => booking._id)
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

    return (
        <BrowserRouter>
            <Routes>

                {/* PUBLIC ROUTE: Only the Login page. No Sidebar/TopBar here. */}
                <Route
                    path="/" element={
                        <PublicRoute>
                            <Login
                                mode={authMode}
                                form={authForm}
                                error={authError}
                                loading={authLoading}
                                onModeChange={setAuthMode}
                                onChange={(value) => setAuthForm(p => ({ ...p, ...value }))}
                                toasts={toasts}
                                onDismiss={dismissToast}
                                setAuthError={setAuthError}
                                setAuthLoading={setAuthLoading}
                                setToken={setToken}
                                setUser={setUser}
                                setAuthForm={setAuthForm}
                                authMode={authMode}
                                authForm={authForm}
                                pushToast={pushToast}
                            />
                        </PublicRoute>
                    } />

                <Route element={<ProtectedRoute />}>
                    <Route element={
                        <DashboardLayout
                            user={user}
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            handleLogout={handleLogout}
                            toasts={toasts}
                            dismissToast={dismissToast}
                        />
                    }>

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
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}