import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from '../TopBar';
import ToastStack, { type ToastMessage } from '../ToastStack';
import type { User } from '../../types';

type DashboardLayoutProps = {
    user: User;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    handleLogout: () => void;
    toasts: ToastMessage[];
    dismissToast: (id: string) => void;
};

export default function DashboardLayout ({ user, isOpen, setIsOpen, handleLogout, toasts, dismissToast }: DashboardLayoutProps){
    return (
        <div className="flex h-screen bg-stone-100 overflow-hidden">
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} userRole={user.role} />

            <main className="flex-1 overflow-y-auto p-7">
                <TopBar user={user} onLogout={handleLogout} />

                <div className="mt-8">
                    {/* This is where the children (Dashboard, Users, etc.) will appear */}
                    <Outlet />
                </div>
            </main>

            <ToastStack toasts={toasts} onDismiss={dismissToast} />
        </div>
    );
};