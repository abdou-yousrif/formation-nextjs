"use client";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

const supabase = createClient()

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const {error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`
        })
        if (error) {
            setMessage(error.message);
        } else {
            setMessage("Un lien de réinitialisation a été envoyé à votre adresse email.");
        }
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md space-y-8">
                <div className="bg-white shadow-xl rounded-2xl px-10 py-12 border border-gray-100">
                    <form onSubmit={handleSubmit}>
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-gray-900">Mot de passe oublié</h2>
                        </div>
                        <div >
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input type="email" 
                                placeholder="Votre email"
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div><br />
                        <button type="submit" className="px-4 py-2 rounded-md bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-60 transition">
                            Envoyer
                        </button>
                        {message && <p>{message}</p>}
                    
                
                    </form>
                </div>
            </div>
        </div>
    )
}
