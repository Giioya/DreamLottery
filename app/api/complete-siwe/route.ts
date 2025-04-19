import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { MiniAppWalletAuthSuccessPayload, verifySiweMessage } from '@worldcoin/minikit-js';

interface IRequestPayload {
    payload: MiniAppWalletAuthSuccessPayload;
    nonce: string;
    }

    export async function POST(req: NextRequest) {
    try {
        const { payload, nonce } = (await req.json()) as IRequestPayload;

        // Obtener cookies correctamente
        const cookiesStore = await cookies(); // Si devuelve una promesa, la resolvemos
        const storedNonce = cookiesStore.get?.('siwe')?.value; // Accedemos de forma segura

        if (nonce !== storedNonce) {
        return NextResponse.json({
            status: 'error',
            isValid: false,
            message: 'Invalid nonce',
        });
        }

        const validMessage = await verifySiweMessage(payload, nonce);

        return NextResponse.json({
        status: 'success',
        isValid: validMessage.isValid,
        });
    } catch (error: any) {
        return NextResponse.json({
        status: 'error',
        isValid: false,
        message: error.message || 'Error en la verificación',
        });
    }
}