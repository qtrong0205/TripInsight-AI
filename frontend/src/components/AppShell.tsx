import { ReactNode } from 'react';
import TopBar from './TopBar';

interface AppShellProps {
    children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
    return (
        <div className="min-h-screen bg-background">
            <TopBar />
            <main className="pt-16">
                {children}
            </main>
        </div>
    );
}
