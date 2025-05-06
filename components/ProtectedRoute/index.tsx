"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/context/WalletAuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { walletAddress } = useWallet();
    const router = useRouter();

    // Si hay una walletAddress se asume que el usuario está autenticado
    const isAuthenticated = !!walletAddress;

    useEffect(() => {
        if (!isAuthenticated) {
        router.push("/login");
        }
    }, [isAuthenticated, router]);

    return isAuthenticated ? <>{children}</> : null;
}

