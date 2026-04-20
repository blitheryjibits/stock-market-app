"use client";

import { useEffect, useState } from "react";
import { headers } from "next/headers";

// Type for the session response
export type Session = {
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
    } | null;
    session: {
      id: string;
      expiresAt: Date;
    } | null;
  } | null;
};

export function useSession(): Session {
  const [session, setSession] = useState<Session>({
    data: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const response = await fetch("/api/auth/get-session", {
          method: "GET",
        });

        if (response.ok) {
          const data = await response.json();
          setSession({ data });
        } else {
          setSession({ data: null });
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
        setSession({ data: null });
      } finally {
        setIsLoading(false);
      }
    };

    getSession();
  }, []);

  return session;
}
