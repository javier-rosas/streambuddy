import { clearUserDataAndToken, getUserToken } from "../utils/userUtils.js";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    chrome.runtime.sendMessage({ type: "startStream", userId });
  };

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
    <div>
      <div>
        <h1>Video Streaming</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter user ID"
          />
          <button type="submit">Start Stream</button>
        </form>
      </div>
      <button onClick={() => logout()} type="button">
        Sign out
      </button>
    </div>
  );
}
