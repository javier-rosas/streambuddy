import {
  VITE_API_AUTH_ENDPOINT,
  VITE_API_USER_ENDPOINT,
  VITE_GOOGLE_AUTH_ENDPOINT,
} from "@/utils/constants";

import { User } from "@/types";

// Function to fetch user data from Google and store it in local storage
export const fetchUserData = async (token: string): Promise<any> => {
  try {
    const response = await fetch(VITE_GOOGLE_AUTH_ENDPOINT || "", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const user = await response.json();

    return user;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
  }
};

// Function to authenticate user and store JWT
export const authenticateUserAndStoreJwt = async (user: any): Promise<any> => {
  try {
    const authResponse = await fetch(VITE_API_AUTH_ENDPOINT || "", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!authResponse.ok) {
      throw new Error(`Error! status: ${authResponse.status}`);
    }

    const { jwt } = await authResponse.json();
    return jwt; // Returning JWT for potential immediate use
  } catch (error) {
    console.error("Failed to authenticate user and store token:", error);
    throw error; // Rethrowing the error to handle it in the caller
  }
};

// Function to call the createOrUpdate endpoint
export const createOrUpdateUser = async (
  jwt: string,
  user: User
): Promise<any> => {
  try {
    const response = await fetch(VITE_API_USER_ENDPOINT || "", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user }),
    });

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create or update user:", error);
    throw error;
  }
};
