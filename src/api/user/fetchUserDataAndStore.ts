const VITE_GOOGLE_AUTH_ENDPOINT = import.meta.env.VITE_GOOGLE_AUTH_ENDPOINT;
const VITE_API_AUTH_ENDPOINT = import.meta.env.VITE_API_AUTH_ENDPOINT;

// Function to fetch user data from Google and store it in local storage
export const fetchUserDataAndStore = async (token: string): Promise<any> => {
  try {
    const response = await fetch(VITE_GOOGLE_AUTH_ENDPOINT, {
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

    localStorage.setItem("userData", JSON.stringify(user));
    localStorage.setItem("userGoogleToken", token);
    return user;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
  }
};

// Function to authenticate user and store JWT
export const authenticateUserAndStoreJwt = async (user: any): Promise<any> => {
  try {
    const authResponse = await fetch(VITE_API_AUTH_ENDPOINT, {
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
    localStorage.setItem("jwt", jwt); // Storing JWT for future use
    return jwt; // Returning JWT for potential immediate use
  } catch (error) {
    console.error("Failed to authenticate user and store token:", error);
    throw error; // Rethrowing the error to handle it in the caller
  }
};
