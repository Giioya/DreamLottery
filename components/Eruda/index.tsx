"use client";

import { ReactNode } from "react";
import dynamic from "next/dynamic";

// Carga Eruda solo en el cliente y en producción
const Eruda = dynamic(() => import("./eruda-provider").then((c) => c.Eruda), {
  ssr: false, // Desactiva SSR para este componente
});

export const ErudaProvider = ({ children }: { children: ReactNode }) => {
  if (process.env.NEXT_PUBLIC_APP_ENV === "production") {
    return <>{children}</>; // En producción no se carga Eruda
  }
  
  return <Eruda>{children}</Eruda>; // En desarrollo sí lo hacemos
};
