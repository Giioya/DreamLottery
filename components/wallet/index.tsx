import { useState, useEffect } from "react";
import { MiniKit } from "@worldcoin/minikit-js";

export function useWalletAuth() {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Cargar datos desde localStorage al iniciar la app
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedWallet = localStorage.getItem("walletAddress");
            const storedUsername = localStorage.getItem("username");

            if (storedWallet) {
                console.log("📌 Wallet recuperada de localStorage:", storedWallet);
                setWalletAddress(storedWallet);
            } else {
                console.warn("⚠️ No se encontró wallet en localStorage.");
            }

            if (storedUsername) {
                console.log("📌 Username recuperado de localStorage:", storedUsername);
                setUsername(storedUsername);
            }
        }
    }, []);

    // Verificar si MiniKit ya tiene un usuario autenticado y actualizar username
    useEffect(() => {
        if (!username && MiniKit.user?.username) {
            console.log("✅ MiniKit detectó el usuario:", MiniKit.user.username);
            setUsername(MiniKit.user.username);
            localStorage.setItem("username", MiniKit.user.username);
        }
    }, [username]);

    const signInWithWallet = async () => {
        setIsLoading(true);

        try {
            if (!MiniKit.isInstalled()) {
                alert("MiniKit no está instalado.");
                setIsLoading(false);
                return;
            }

            const res = await fetch(`/api/nonce`);
            const { nonce } = await res.json();

            const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
                nonce,
                requestId: "0",
                expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                notBefore: new Date(Date.now() - 24 * 60 * 60 * 1000),
            });

            if (finalPayload.status === "error") {
                alert("Error en la autenticación.");
                setIsLoading(false);
                return;
            }

            const verifyRes = await fetch("/api/complete-siwe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ payload: finalPayload, nonce }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.status === "success" && verifyData.isValid) {
                const address = MiniKit.user?.walletAddress ?? null;
                if (address) {
                    console.log("✅ Wallet obtenida de MiniKit:", address);
                    setWalletAddress(address);
                    localStorage.setItem("walletAddress", address);
                } else {
                    console.warn("⚠️ MiniKit no devolvió una wallet válida.");
                }

                if (MiniKit.user?.username) {
                    console.log("✅ Username obtenido de MiniKit:", MiniKit.user.username);
                    setUsername(MiniKit.user.username);
                    localStorage.setItem("username", MiniKit.user.username);
                }
            }
        } catch (error) {
            console.error("Error en la autenticación:", error);
            alert("Hubo un problema con la autenticación.");
        } finally {
            setIsLoading(false);
        }
    };

    return { walletAddress, username, signInWithWallet, isLoading };
}












