import {
  authenticateUserAndStoreToken,
  fetchUserDataAndStore,
} from "../api/user/fetchUserDataAndStore";

export const getUserData = () => {
  const data = localStorage.getItem("userData");
  return data ? JSON.parse(data) : null;
};

export const getUserToken = () => {
  return localStorage.getItem("userGoogleToken");
};

// set userData and userToken to null
export const clearUserDataAndToken = () => {
  localStorage.removeItem("userData");
  localStorage.removeItem("userGoogleToken");
  localStorage.removeItem("jwt");
};

export const logout = (navigate: any) => {
  const userGoogleToken = getUserToken();
  if (!userGoogleToken) return;
  chrome.runtime.sendMessage(
    { type: "logout", token: userGoogleToken },
    function (response) {
      if (!response || !response.success) {
        console.error("Failed to logout");
        return;
      }
      navigate("/");
      clearUserDataAndToken();
    }
  );
};

export const login = (navigate: any) => {
  chrome.runtime.sendMessage({ type: "login" }, async function (response) {
    if (!response || !response.token) return;
    try {
      const user = await fetchUserDataAndStore(response.token);
      await authenticateUserAndStoreToken(user);
      if (user) {
        navigate("/home");
      }
    } catch (error) {
      console.error("Failed to login:", error);
    }
  });
};
