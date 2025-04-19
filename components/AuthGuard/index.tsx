"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MiniKit } from "@worldcoin/minikit-js";
import Image from "next/image";
import carga from "@/public/images/logoLottery.jpg"; // Ajusta la ruta según la ubicación real de la imagen

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;

        const storedWallet = typeof window !== "undefined" ? localStorage.getItem("walletAddress") : null;
        const username = MiniKit.user?.username || storedWallet;

        if (MiniKit.user?.username) {
            localStorage.setItem("username", MiniKit.user.username);
            localStorage.setItem("walletAddress", MiniKit.walletAddress ?? "");
        
            // Borra el localStorage cada 30 segundos
            setInterval(() => {
                localStorage.clear();
            }, 86400000);
        }

        // Redirigir al login si no hay usuario autenticado
        if (pathname === "/" && !username) {
            router.push("/login");
        }

    }, [router, pathname, isClient, MiniKit.user?.username]); // Se agregó MiniKit.user?.username a las dependencias

    if (!isClient) {
        return (
            <div className="flex justify-center mt-4">
                <Image 
                    src={carga} 
                    alt="Carga BuenoCambios" 
                    className="carga_bc" 
                    width={800} 
                    height={600} 
                />
            </div>
        );
    }

    return <>{children}</>;
}