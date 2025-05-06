"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { MiniKit } from "@worldcoin/minikit-js";

interface WalletContextType {
    walletAddress: string | null;
    username: string | null;
    setWalletAddress: (address: string | null) => void;
    setUsername: (username: string | null) => void;
    }

    const WalletContext = createContext<WalletContextType>({
    walletAddress: null,
    username: null,
    setWalletAddress: () => {},
    setUsername: () => {},
    });

    export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        const checkAuthStatus = async () => {
        try {
            console.log("[WalletContext] Checking auth status");
            const res = await fetch("/api/me");
            const data = await res.json();
            console.log("[WalletContext] Auth status response:", data);
            if (data.walletAddress) {
            console.log("[WalletContext] Setting wallet address:", data.walletAddress);
            setWalletAddress(data.walletAddress);
            if (MiniKit.user?.username) {
                console.log("[WalletContext] Setting username:", MiniKit.user.username);
                setUsername(MiniKit.user.username);
            }
            }
        } catch (error) {
            console.error("[WalletContext] Error checking auth status", error);
        }
        };

        checkAuthStatus();
    }, []);

    return (
        <WalletContext.Provider value={{ walletAddress, username, setWalletAddress, setUsername }}>
        {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => useContext(WalletContext);
