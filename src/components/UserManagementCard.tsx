import type { FormEvent } from "react";
import type { User, UserFormState, UserRole } from "../types";

interface UserManagementCardProps {
  users: User[];
  user: User;
  form: UserFormState;
  error: string;
  loading: boolean;
  saving: boolean;
  deletingId: string | null;
  onFormChange: (value: Partial<UserFormState>) => void;
  onCreate: (event: FormEvent<HTMLFormElement>) => void;
  handleRoleChange: (id: string, role: UserRole) => void;
  onDelete: (id: string) => void;
}

export default function UserManagementCard({
  users,
  user,
  form,
  error,
  loading,
  saving,
  deletingId,
  onFormChange,
  onCreate,
  handleRoleChange,
  onDelete
}: UserManagementCardProps) {

    const handleDelete = async (
    id: string,

  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this user?`
    );

    if (!confirmed) return;

    try {
      await onDelete(id);
    } catch (error) {
      console.error(error);
      alert("Failed to delete user.");
    }
  };

  return (
    <section className="card animate-fade-up">
      <h2 className="text-lg font-semibold text-stone-900">User Management</h2>
      <form className="mt-4 grid gap-4 lg:grid-cols-4" onSubmit={onCreate}>
        <label className="grid gap-2 text-sm font-semibold text-stone-700">
          Name
           <input placeholder="Enter name"
            className="input"
            value={form.name}
            onChange={(event) => onFormChange({ name: event.target.value })}
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-stone-700">
          Password
           <input placeholder="Enter password"
            className="input"
            type="password"
            value={form.password}
            onChange={(event) => onFormChange({ password: event.target.value })}
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-stone-700">
          Role
          <select
            className="input"
            value={form.role}
            onChange={(event) => onFormChange({ role: event.target.value as UserRole })}
          >

            <option value="user">User</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <div className="flex items-end">
          <button className="btn-primary" type="submit" disabled={saving}>
            {saving ? "Creating..." : "Create user"}
          </button>
        </div>
      </form>
      {error && <p className="mt-3 text-sm font-semibold text-rose-600">{error}</p>}
      <div className="mt-6 grid gap-3">
        {loading && (
          <div className="grid gap-3">
            <div className="skeleton h-12 w-full" />
            <div className="skeleton h-12 w-full" />
          </div>
        )}
        {!loading &&
          users.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-3"
            >
              <div>
                <p className="font-semibold text-stone-800">{item.name}</p>
                <p className="text-sm text-stone-500">{item.role}</p>
              </div>
              <select
                className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm"
                value={item.role}
                onChange={(event) => handleRoleChange(item.id, event.target.value as UserRole)}
              >

                <option value="user">User</option>
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
              </select>

              <button
                className="btn-danger"
                type="button"
                onClick={() => handleDelete(item.id)}
                disabled={user.id === item.id}
              >
                {deletingId === item.id ? "Removing..." : "Delete"}
              </button>
            </div>
          ))}
      </div>
    </section>
  );
}
