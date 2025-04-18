"use client";

import eruda from "eruda";
import { useEffect } from "react";

export const Eruda = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
      try {
        eruda.init();
      } catch (error) {
        console.log("Eruda failed to initialize", error);
      }
    }
  }, []);

  return <>{children}</>;
};

