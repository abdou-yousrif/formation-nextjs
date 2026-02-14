"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

const supabase = createClient()

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getSession = async () => {
            const hash = window.location.hash;
            if(hash) {
                const {error} = await supabase.auth.exchangeCodeForSession(hash);
                if (error) {
                    setMessage("Session invalide. Veuillez réessayer le lien de réinitialisation.");
                }
            }
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setMessage("Session invalide. Veuillez réessayer le lien de réinitialisation.");               
            }
            setLoading(false);
        }
        getSession();
    }, [])

    const handleupdate = async (e: React.FormEvent) => {
        e.preventDefault();

        const {error} = await supabase.auth.updateUser({
            password
        })
        if (error) {
            setMessage(error.message);
        } else {
            setMessage("Mot de passe mis à jour avec succès.");
            window.location.href = `${window.location.origin}/login`;
        }
    }

    if (loading) {
        return <p>Chargement...</p>;
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md space-y-8">
                <div className="bg-white shadow-xl rounded-2xl px-10 py-12 border border-gray-100">
                    <form onSubmit={handleupdate}>
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-gray-900">Nouveau mot de passe</h2>
                        </div>
                        <div >
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Nouveau mot de passe
                            </label>
                            <input type="password"
                                placeholder="Nouveau mot de passe"
                                className="border border-gray-300 rounded-md px-4 py-2 w-full"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div><br />
                        <button type="submit" className="px-4 py-2 rounded-md bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-60 transition">
                            Réinitialiser
                        </button>
                        {message && <p>{message}</p>}
                    </form>
                </div>
            </div>
        </div>
    )
}