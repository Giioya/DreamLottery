'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { MiniKit } from '@worldcoin/minikit-js'

interface WalletAuthContextType {
    isAuthenticated: boolean
    walletAddress: string | null
    username: string | null
    loading: boolean // NUEVO
    signInWithWallet: () => Promise<void>
}

const WalletAuthContext = createContext<WalletAuthContextType | undefined>(undefined)

export const WalletAuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [walletAddress, setWalletAddress] = useState<string | null>(null)
    const [username, setUsername] = useState<string | null>(null)

    // Recuperar sesión al cargar
    const [loading, setLoading] = useState(true); // NUEVO

        useEffect(() => {
            const storedAuth = localStorage.getItem('isAuthenticated');
            const storedAddress = localStorage.getItem('walletAddress');
            const storedUsername = localStorage.getItem('username');

            if (storedAuth === 'true' && storedAddress) {
                setIsAuthenticated(true);
                setWalletAddress(storedAddress);
                setUsername(storedUsername);
            }
            setLoading(false); // Cuando termina de intentar recuperar
        }, []);

    const signInWithWallet = async () => {
        if (!MiniKit.isInstalled()) {
            console.warn('MiniKit no detectado.')
            return
        }

        try {
            const res = await fetch('/api/nonce')
            const { nonce } = await res.json()

            const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
                nonce,
                requestId: '0',
                expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                notBefore: new Date(Date.now() - 24 * 60 * 60 * 1000),
                statement: 'Inicia sesión en Dream Lottery',
            })

            if (finalPayload.status === 'error') {
                console.error('Error en walletAuth')
                return
            }

            const validateRes = await fetch('/api/complete-siwe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ payload: finalPayload, nonce }),
            })

            const validateData = await validateRes.json()

            if (validateData.status === 'success' && validateData.isValid) {
                setIsAuthenticated(true)
                setWalletAddress(MiniKit.walletAddress)
                setUsername(MiniKit.user ? MiniKit.user.username : null)

                // Guardar en localStorage
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('walletAddress', MiniKit.walletAddress || '');
                localStorage.setItem('username', MiniKit.user?.username || '');
            } else {
                console.error('Error validando SIWE')
            }
        } catch (error) {
            console.error('Error en signInWithWallet:', error)
        }
    }

    return (
        <WalletAuthContext.Provider value={{ isAuthenticated, walletAddress, username, loading, signInWithWallet }}>
            {children}
        </WalletAuthContext.Provider>
    )
}

export const useWalletAuth = () => {
    const context = useContext(WalletAuthContext)
    if (context === undefined) {
        throw new Error('useWalletAuth debe usarse dentro de WalletAuthProvider')
    }
    return context
}