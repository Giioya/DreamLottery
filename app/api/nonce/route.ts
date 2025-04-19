import { NextResponse } from "next/server";

export async function GET() {
  // Generar un nonce aleatorio (mínimo 8 caracteres alfanuméricos)
    const nonce = crypto.randomUUID().replace(/-/g, "");

    // Crear la respuesta y setear la cookie
    const response = NextResponse.json({ nonce });
    response.cookies.set("siwe", nonce, { secure: true });

    return response;
}

