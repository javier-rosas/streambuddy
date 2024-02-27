import { clearUserDataAndToken, getUserToken } from "../utils/userUtils";

import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const logout = () => {
    const userToken = getUserToken();
    // Retrieve the token from where it's stored (e.g., context, local storage)
    if (!userToken) return;
    chrome.runtime.sendMessage(
      { type: "logout", token: userToken },
      function (response) {
        if (!response || !response.success) {
          console.error("Failed to logout");
          return;
        }
        // Perform any cleanup here (e.g., clearing local storage, updating state)
        navigate("/");
        clearUserDataAndToken();
      }
    );
  };

  return (
    <div className="bg-red-700">
      <button onClick={() => logout()} type="button">
        Sign out
      </button>
    </div>
  );
}
