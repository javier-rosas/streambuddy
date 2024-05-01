import { fetchUserDataAndStore } from "../api/user/fetchUserDataAndStore";

export const getUserData = () => {
  const data = localStorage.getItem("userData");
  return data ? JSON.parse(data) : null;
};

export const getUserToken = () => {
  return localStorage.getItem("userToken");
};

// set userData and userToken to null
export const clearUserDataAndToken = () => {
  localStorage.removeItem("userData");
  localStorage.removeItem("userToken");
};

export const logout = (navigate: any) => {
  const userToken = getUserToken();
  if (!userToken) return;
  chrome.runtime.sendMessage(
    { type: "logout", token: userToken },
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
    const user = await fetchUserDataAndStore(response.token);
    if (user) {
      navigate("/home");
    }
  });
};
