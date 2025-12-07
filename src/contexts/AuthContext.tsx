import { useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { AuthContext, User, AuthContextType } from './ContextBase';

// Types are imported from ContextBase to avoid duplicate interface declarations

const createUser = async (id: string, name: string, email: string, createdAt: string) => {
    try {
        const response = await fetch("http://localhost:3000/api/auth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            credentials: "include", // include cookies if the server uses them
            body: JSON.stringify({ id, name, email, createdAt }),
        });

        const contentType = response.headers.get("content-type") || "";
        const isJson = contentType.includes("application/json");
        const payload = isJson ? await response.json() : null;

        if (!response.ok) {
            const message =
                (payload && payload.message) ||
                `HTTP error! Status: ${response}`;
            throw new Error(message);
        }

        console.log("Response:", payload);
        return payload; // { success: true, data: {...} }
    } catch (error: any) {
        console.error("Error:", error.message);
        throw error;
    }
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    // Initialize session from Supabase on mount
    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const sUser = session?.user;
            if (sUser) {
                setUser({
                    id: sUser.id,
                    name: sUser.user_metadata?.name ?? sUser.email ?? 'User',
                    email: sUser.email ?? '',
                    avatar: sUser.user_metadata?.avatar ?? 'https://avatar.iran.liara.run/public/4',
                    createdAt: sUser.created_at,
                });
            }
        };
        init();

        const { data: authSub } = supabase.auth.onAuthStateChange((_event, session) => {
            const sUser = session?.user;
            if (sUser) {
                setUser({
                    id: sUser.id,
                    name: sUser.user_metadata?.name ?? sUser.email ?? 'User',
                    email: sUser.email ?? '',
                    avatar: sUser.user_metadata?.avatar ?? 'https://avatar.iran.liara.run/public/4',
                    createdAt: sUser.created_at,
                });
            } else {
                setUser(null);
            }
        });

        return () => {
            authSub?.subscription?.unsubscribe();
        };
    }, []);

    const login = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        const sUser = data.user;
        console.log(sUser)
        if (sUser) {
            setUser({
                id: sUser.id,
                name: sUser.user_metadata?.name ?? sUser.email ?? 'User',
                email: sUser.email ?? email,
                avatar: sUser.user_metadata?.avatar ?? 'https://avatar.iran.liara.run/public/4',
                createdAt: sUser.created_at,
            });
        }
    };

    const register = async (name: string, email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name },
            },
        });

        if (error) throw error;
        const sUser = data.user;
        if (sUser) {
            createUser(sUser.id, sUser.user_metadata.name, sUser.user_metadata.email, sUser.created_at)
            setUser({
                id: sUser.id,
                name: (name && name.trim()) || sUser.email || 'User',
                email: sUser.email ?? email,
                avatar: sUser.user_metadata?.avatar ?? 'https://avatar.iran.liara.run/public/4',
                createdAt: sUser.created_at,
            });
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

