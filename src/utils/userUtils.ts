import {
  authenticateUserAndStoreJwt,
  createOrUpdateUser,
  fetchUserData,
} from "@/services/user";

import { User } from "@/types";

// Function to store user data in local storage
const setUserDataInLocalStorage = (
  userData: User,
  userGoogleToken: string,
  jwt: string
) => {
  localStorage.setItem("userData", JSON.stringify(userData));
  localStorage.setItem("userGoogleToken", userGoogleToken);
  localStorage.setItem("jwt", jwt); // Storing JWT for future use

  // Set data in chrome.storage.local
  chrome.storage.local.set({
    userData: userData,
  });
};

// set userData and userToken to null
export const clearUserDataAndToken = () => {
  localStorage.removeItem("userData");
  localStorage.removeItem("userGoogleToken");
  localStorage.removeItem("jwt");

  chrome.storage.local.remove(["userData"]);
};

// Function to get user data from local storage
export const getUserData = () => {
  const data = localStorage.getItem("userData");
  return data ? JSON.parse(data) : null;
};

// Function to get JWT from local storage
export const getUserGoogleToken = () => {
  return localStorage.getItem("userGoogleToken");
};

// Function to get JWT from local storage
export const getJwtToken = () => {
  return localStorage.getItem("jwt");
};

// Function to logout user
export const logout = (navigate: any) => {
  const userGoogleToken = getUserGoogleToken();
  if (!userGoogleToken) return;
  chrome.runtime.sendMessage(
    { type: "logout", token: userGoogleToken },
    function (response) {
      if (!response || !response.success) {
        console.error("Failed to logout");
        return;
      }
      clearUserDataAndToken();
      chrome.identity.clearAllCachedAuthTokens(() => {
        console.log("Cleared cached auth tokens");
        navigate("/");
      });
    }
  );
};

// Function to login user
export const login = (navigate: any) => {
  chrome.runtime.sendMessage({ type: "login" }, async function (response) {
    if (!response || !response.token) return;
    try {
      const token = response.token;
      const user = await fetchUserData(token);
      const jwt = await authenticateUserAndStoreJwt(user);
      if (user && jwt) {
        await createOrUpdateUser(jwt, user);
        setUserDataInLocalStorage(user, token, jwt);
        navigate("/home");
      }
    } catch (error) {
      console.error("Failed to login:", error);
    }
  });
};
