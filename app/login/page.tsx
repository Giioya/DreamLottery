'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWalletAuth } from "@/components/wallet/WalletAuthContext";

export default function LoginPage() {
    const { isAuthenticated, signInWithWallet } = useWalletAuth();
    const router = useRouter();

    useEffect(() => {
        const tryLogin = async () => {
            const isWorldApp = window?.navigator?.userAgent.includes('WorldApp');
            
            // Si el usuario no está autenticado y está en WorldApp, intentamos iniciar sesión
            if (isWorldApp && !isAuthenticated) {
                await signInWithWallet();
            }
            
            // Solo redirigir después de asegurarnos que el usuario esté autenticado
            if (isAuthenticated) {
                router.push('/');  // Redirige a la página principal después de iniciar sesión
            }
        };

        tryLogin();
    }, [isAuthenticated, signInWithWallet, router]);

    return (
        <main className="min-h-screen flex items-center justify-center bg-white">
            <h1 className="text-xl font-bold">Conectando tu Wallet...</h1>
        </main>
    );
}