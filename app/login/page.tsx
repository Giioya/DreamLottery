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
            if (isWorldApp && !isAuthenticated) {
                await signInWithWallet();
            }
        };

        tryLogin();
    }, [isAuthenticated, signInWithWallet]);

    // Nuevo useEffect aparte: cuando realmente ya esté autenticado, ahí sí redirigimos
    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    return (
        <main className="min-h-screen flex items-center justify-center bg-white">
            <h1 className="text-xl font-bold">Conectando tu Wallet...</h1>
        </main>
    );
}