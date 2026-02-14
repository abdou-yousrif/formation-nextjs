"use client"

import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export function useSupabaseUser() {
    const [user, setUser] = useState<User | null >(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();
        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                const currentUser = session?.user ?? null;
                setUser(currentUser);
                setLoading(false);
            }
        );
        // Check initial user on mount
        supabase.auth.getUser().then(({data : {user}}) => {
            setUser(user);
            setLoading(false);
        });
        return () => {
            authListener.subscription.unsubscribe();
        };

    }, []);

    return { user, loading };
}

