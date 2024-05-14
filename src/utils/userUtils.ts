import {
  authenticateUserAndStoreJwt,
  createOrUpdateUser,
  fetchUserData,
} from "@/api/user";

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
};

// Function to get user data from local storage
export const getUserData = () => {
  const data = localStorage.getItem("userData");
  return data ? JSON.parse(data) : null;
};

// Function to get JWT from local storage
export const getUserToken = () => {
  return localStorage.getItem("userGoogleToken");
};

// set userData and userToken to null
export const clearUserDataAndToken = () => {
  localStorage.removeItem("userData");
  localStorage.removeItem("userGoogleToken");
  localStorage.removeItem("jwt");
};

// Function to logout user
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
