import { VITE_API_SESSION_ENDPOINT } from "@/utils/constants";

// Function to fetch session data
export const postSession = async (
  token: string,
  userEmail: string
): Promise<any> => {
  try {
    const response = await fetch(VITE_API_SESSION_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userEmail }),
    });

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const session = await response.json();

    return session;
  } catch (error) {
    console.error("Failed to post session:", error);
    throw error;
  }
};
