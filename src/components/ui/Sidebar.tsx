import { Menu, Home, User, ClipboardClock, BarChart3, ChevronRight, ChevronLeft } from "lucide-react";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  userRole: string;
}

export default function Sidebar({ isOpen, setIsOpen, userRole }: SidebarProps) {
  const isOwnerOrAdmin = userRole === "owner" || userRole === "admin";
  const isAdmin = userRole === "admin";

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-x-4 p-3 rounded-xl transition-all duration-200 ${isActive ? "bg-amber-500 text-white shadow-md" : "text-stone-400 hover:bg-stone-800 hover:text-white"
    }`;

  return (
    <div className={`bg-stone-950 p-5 pt-8 ${isOpen ? "w-72" : "w-20"} duration-300 relative flex flex-col border-r border-stone-800`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-4 top-9 bg-white text-stone-900 border border-stone-200 rounded-full p-1.5 shadow-md hover:scale-105 active:scale-95 transition"
      >
        {isOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div className="flex items-center gap-3 px-2">

        <span className={`font-semibold text-lg tracking-wide text-white duration-200 ${!isOpen && "opacity-0 pointer-events-none"}`}>
          RoomBox
        </span>
      </div>

      <nav className="mt-10 space-y-2 flex-1">
        <NavLink to="/dashboard" className={navLinkClass}>
          <Home size={20} />
          <span className={`${!isOpen && "hidden"} origin-left duration-200`}>Dashboard</span>
        </NavLink>

        {isAdmin && (
          <NavLink to="/users" className={navLinkClass}>
            <User size={20} />
            <span className={`${!isOpen && "hidden"} origin-left duration-200`}>User Management</span>
          </NavLink>
        )}

        {isOwnerOrAdmin && (
          <NavLink to="/booking-list" className={navLinkClass}>
            <BarChart3 size={20} />
            <span className={`${!isOpen && "hidden"} origin-left duration-200`}>Owner Insights</span>
          </NavLink>
        )}
      </nav>
    </div>
  );
}