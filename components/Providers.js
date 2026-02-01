"use client";
import { AuthProvider } from '@/components/AuthProvider';
import { ToastProvider } from '@/components/Toast';

export function Providers({ children }) {
    return (
        <AuthProvider>
            <ToastProvider>
                {children}
            </ToastProvider>
        </AuthProvider>
    );
}
