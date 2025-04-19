'use client';

import { useRouter } from "next/navigation";
import { useWalletAuth } from "@/components/wallet/WalletAuthContext";
import { useState, useEffect } from "react";

export default function LoginPage() {
    const { isAuthenticated, signInWithWallet } = useWalletAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isClient, setIsClient] = useState(false);  // Para asegurarnos de que estamos en el cliente

    // Comprobar si estamos en el cliente
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Si el usuario ya está autenticado, redirigir directamente
    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    const handleLogin = async () => {
        setLoading(true);
        try {
            await signInWithWallet();
            router.push('/');
        } catch (error) {
            console.error('Error al iniciar sesión', error);
        } finally {
            setLoading(false);
        }
    };

    // Si no estamos en el cliente, no renderizamos nada
    if (!isClient) return null;

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