import { BASE_URL } from "@/lib/config";
import { ApiResponse } from "@/types/api";
import { UrlResponse } from "@/types/url";


export const urlService = {

    async shortenUrl(originalUrl: string, expirationOption: number): Promise<UrlResponse> {
        try {
            const expiresInDays = expirationMap[expirationOption];
            const res = await fetch(`${BASE_URL}/api/v1/url/shorten`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ originalUrl, expiresInDays}),
            });

            if (!res.ok) {
                throw new Error("Failed to shorten URL");
            }

            const json = (await res.json()) as ApiResponse<UrlResponse>;
         return json.data;
        } catch (error) {
            console.error("Error during URL shortening:", error);
            throw error;
        }
    },

    async getUserUrls(): Promise<UrlResponse[]> {
        try {
          const res = await fetch(`${BASE_URL}/api/v1/url/`, {
            credentials: "include",
          });
    
          if (!res.ok) {
            throw new Error("Failed to fetch user URLs");
          }
    
          const json = (await res.json()) as ApiResponse<UrlResponse[]>;
         return json.data;
         
        } catch (error) {
          console.error("Error fetching user URLs:", error);
          throw error;
        }
      },

      async deleteUrl(shortcode: string): Promise<void> {
        const res = await fetch(`${BASE_URL}/api/v1/url/${shortcode}`, {
          method: "DELETE",
          credentials: "include",
        });
      
        if (!res.ok) {
          throw new Error("Failed to delete URL");
        }
      }
      


}

const expirationMap: Record<string, number | null> = {
    "1hour": 1 / 24,
    "24hours": 1,
    "7days": 7,
    "30days": 30,
    "never": null,
  };
  