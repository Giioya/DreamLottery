"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { MiniKit } from "@worldcoin/minikit-js";

interface AuthContextType {
    isLoggedIn: boolean;
    walletAddress: string | null;
    username: string | null;
    signInWithWallet: () => Promise<void>;
    }

    export const AuthContext = createContext<AuthContextType | undefined>(undefined);

    export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);

    const signInWithWallet = async () => {
        if (!MiniKit.isInstalled()) {
        alert('Por favor abre esta página desde World App');
        return;
        }

        try {
        const res = await fetch(`/api/nonce`);
        const { nonce } = await res.json();

        const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
            nonce,
            requestId: '0',
            expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
            notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
            statement: 'Autenticación en Dream Lottery',
        });

        if (finalPayload.status === 'error') {
            console.error("Error en Wallet Auth");
            return;
        }

        const response = await fetch('/api/complete-siwe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ payload: finalPayload, nonce }),
        });

        const data = await response.json();

        if (data.status === 'success' && data.isValid) {
            setIsLoggedIn(true);
            setWalletAddress(MiniKit.walletAddress);
            setUsername(MiniKit.user?.username ?? null);
        } else {
            console.error("Error al validar SIWE");
        }
        } catch (error) {
        console.error("Error en Wallet Auth:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, walletAddress, username, signInWithWallet }}>
        {children}
        </AuthContext.Provider>
    );
    };

    // Hook para usar el contexto
    export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
};
