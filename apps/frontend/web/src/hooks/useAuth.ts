import { useState, useEffect } from "react";

export function useAccessToken() {
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        const refreshAccessToken = async () => {
            try {
                const response = await fetch("/api/auth/refresh");
                
                if (response.status === 401) {
                    console.log("No active session.");
                    setAccessToken(null);
                    return;
                }

                if (!response.ok) throw new Error("Unauthorized");

                const data = await response.json();
                setAccessToken(data.accessToken);
            } catch (error) {
                console.error("Access token failed: ", error);
                setAccessToken(null);
            }
        };

        refreshAccessToken();
        const interval = setInterval(refreshAccessToken, 14 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    return accessToken;
}