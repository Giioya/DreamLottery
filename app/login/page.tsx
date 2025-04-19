'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWalletAuth } from "@/components/wallet/WalletAuthContext";

export default function LoginPage() {
    const { isAuthenticated, signInWithWallet } = useWalletAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    const handleLogin = async () => {
        await signInWithWallet();
        // El useEffect de arriba redirigirá automáticamente si el login fue exitoso
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-white space-y-4">
            <h1 className="text-xl font-bold">Inicia sesión en Dream Lottery</h1>
            <button
                onClick={handleLogin}
                className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition"
            >
                Iniciar sesión
            </button>
        </main>
    );
}