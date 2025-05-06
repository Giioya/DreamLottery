"use client"

import { useRouter } from 'next/navigation';
import { WalletAuth } from '@/components/wallet'; 

export default function Login() {
    const router = useRouter();

    const handleSuccess = (walletAddress: string, username: string) => {
    
        localStorage.setItem("walletAddress", walletAddress);
        localStorage.setItem("username", username);
    
        router.push('/');
    };
    

    const handleError = (error: string) => {
        console.error('Error de autenticación:', error);
    };

    return (
        <main
            className="min-h-screen bg-fixed bg-cover bg-center flex items-center justify-center"
            style={{
                backgroundImage: "url('/images/login_image.png')",
            }}
        >

        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10 w-full">
            <img
                src="/images/lottery_title3.png"
                alt="Título de la Lotería"
                className="w-[60rem] h-[13rem] object-fill"
            />
            </div>

        <div className="login-container mb-60 bg-gray-200 hover:bg-gray-300 border-8 border-[#38b6ff] rounded-full relative glow-border">
            <WalletAuth lang="es" onSuccess={handleSuccess} onError={handleError} />
        </div>
        </main>
    );
    }