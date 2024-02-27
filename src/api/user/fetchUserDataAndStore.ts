export const fetchUserDataAndStore = async (token: string) => {
  const API_ENDPOINT = "https://www.googleapis.com/oauth2/v1/userinfo?alt=json";

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("User Data in fetchUserDataAndStore.ts:", result);
    localStorage.setItem("userData", JSON.stringify(result));
    return result;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
  }
};
