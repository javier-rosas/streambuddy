import { getUserData, login } from "@/utils/userUtils";

import reactLogo from "@/assets/react.svg";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (getUserData()) navigate("/home");
  }, []);

  return (
    <div className="bg-indigo-700">
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Streambuddy</h1>
      <div className="card">
        <button onClick={() => login(navigate)}>Log In</button>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}
