import { BASE_URL } from "@/lib/config";
import { UrlResponse } from "@/types/url";


export const urlService = {

    async shortenUrl(originalUrl: string, expiresInDays: number) {
        try {
            const res = await fetch(`${BASE_URL}/api/v1/url/shorten`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ originalUrl, expiresInDays}),
            });

            if (!res.ok) {
                throw new Error("Failed to shorten URL");
            }

            return await res.json();
        } catch (error) {
            console.error("Error during URL shortening:", error);
            throw error;
        }
    },

    async getUserUrls(): Promise<UrlResponse[]> {
        try {
          const res = await fetch(`${BASE_URL}/api/v1/url`, {
            credentials: "include",
          });
    
          if (!res.ok) {
            throw new Error("Failed to fetch user URLs");
          }
    
          return (await res.json()) as UrlResponse[];
        } catch (error) {
          console.error("Error fetching user URLs:", error);
          throw error;
        }
      },


}