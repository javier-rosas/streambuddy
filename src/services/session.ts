import {
  VITE_API_JOIN_ENDPOINT,
  VITE_API_SESSION_ENDPOINT,
} from "@/utils/constants";

// Function to create session data
export const createSession = async (
  token: string,
  userEmail: string
): Promise<any> => {
  try {
    const response = await fetch(VITE_API_SESSION_ENDPOINT || "", {
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

// Function to join session using token, link, and userEmail
export const getSession = async (link: string): Promise<any> => {
  try {
    const response = await fetch(`${VITE_API_JOIN_ENDPOINT}/${link}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const session = await response.json();

    return session;
  } catch (error) {
    console.error("Failed to join session:", error);
    throw error;
  }
};
