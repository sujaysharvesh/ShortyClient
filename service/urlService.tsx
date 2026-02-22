import { API_URL, BASE_URL } from "@/lib/config";
import { ApiResponse } from "@/types/api";
import { UrlResponse } from "@/types/url";


export const urlService = {

    async shortenUrl(originalUrl: string, expirationOption: string): Promise<UrlResponse> {
        try {
            const expiresInMins = expirationMap[expirationOption];
            console.log("Shortening URL expiresInDays", expiresInMins);
            const res = await fetch(`${API_URL}/url/shorten`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ originalUrl, expiresInMins}),
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
          const res = await fetch(`${API_URL}/url/`, {
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
        const res = await fetch(`${API_URL}/api/v1/url/${shortcode}`, {
          method: "DELETE",
          credentials: "include",
        });
      
        if (!res.ok) {
          throw new Error("Failed to delete URL");
        }
      },

      async redirect(shortcode: string) {
        await fetch(`${API_URL}/${shortcode}`, {
          method: "GET",
          credentials: "include",
        })
      }
      

}

const expirationMap: Record<string, number | null> = {
  "1hour": 60,
  "24hours": 1440,
  "7days": 10080,
  "30days": 43200,
};

  