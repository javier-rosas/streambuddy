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
