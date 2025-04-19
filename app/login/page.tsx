'use client';

import { useRouter } from "next/navigation";
import { useWalletAuth } from "@/components/wallet/WalletAuthContext";
import { useState } from "react";

export default function LoginPage() {
    const { isAuthenticated, signInWithWallet } = useWalletAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            await signInWithWallet();
            // Redirigir manualmente después de iniciar sesión
            router.push('/');
        } catch (error) {
            console.error('Error al iniciar sesión', error);
        } finally {
            setLoading(false);
        }
    };

    // Si ya está autenticado, redirigir directamente (opcional)
    if (isAuthenticated) {
        router.push('/');
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-white space-y-4">
            <h1 className="text-xl font-bold">Inicia sesión en Dream Lottery</h1>
            <button
                onClick={handleLogin}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
                {loading ? 'Conectando...' : 'Iniciar sesión'}
            </button>
        </main>
    );
}