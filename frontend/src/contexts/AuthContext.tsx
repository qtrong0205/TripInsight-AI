import { useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { AuthContext, User, AuthContextType } from './ContextBase';

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

    // define loadUser inside to access setUser
    const loadUser = async (session) => {
        try {
            if (!session) {
                return;
            }

            const res = await fetch('http://localhost:3000/api/auth/me', {
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                    Accept: 'application/json',
                },
                credentials: 'include',
            });

            const contentType = res.headers.get('content-type') || '';
            if (!res.ok) {
                const text = await res.text();
                console.error(`/api/me error ${res.status}:`, text);
                if (res.status === 401) setUser(null);
                return;
            }

            if (!contentType.includes('application/json')) {
                const text = await res.text();
                console.error('Non-JSON response from /api/me:', text);
                return;
            }

            const json = await res.json();
            if (json?.data) {
                const user = json.data;
                setUser({
                    id: user?.id,
                    name: user?.username,
                    email: user?.email,
                    avatar: user?.avatar,
                    createdAt: user?.created_at,
                    role: user?.role || "guest",
                });
            } else {
                console.warn('No data field in /api/me response:', json);
            }
        } catch (err) {
            console.error("loadUser error:", err);
        }
    };

    // Initialize session from Supabase on mount
    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            await loadUser(session);
        };
        init();

        const { data: authSub } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
                await loadUser(session);
            }

            if (event === 'SIGNED_OUT') {
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

        if (data.session) {
            await loadUser(data.session);
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
        if (error) {
            console.error("Supabase signUp error:", error);
            throw error;
        }

        const sUser = data.user;

        if (sUser && (sUser.identities?.length === 0)) {
            const tempError: any = new Error("Email đã tồn tại.");
            tempError.code = "email-existed";
            throw tempError;
        }
        if (sUser) {
            createUser(sUser.id, sUser.user_metadata.name, sUser.user_metadata.email, sUser.created_at)
            setUser({
                id: sUser.id,
                name: (name && name.trim()) || sUser.email || 'User',
                email: sUser.email ?? email,
                avatar: sUser.user_metadata?.avatar ?? 'https://avatar.iran.liara.run/public/4',
                createdAt: sUser.created_at,
                role: 'guest',
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

