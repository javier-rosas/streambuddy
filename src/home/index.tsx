import ChoosePlatform from "./choosePlatform";
import { getUserData } from "../utils/userUtils";
import { logout } from "../utils/userUtils.js";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const user = getUserData();

  console.log("user", user);

  return (
    <>
      <button
        type="button"
        onClick={() => logout(navigate)}
        className="absolute top-4 right-4 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        Sign Out
      </button>

      <div className="flex flex-col items-center justify-center mt-16">
        <div className="mb-8">
          <div className="mx-auto flex items-center justify-center rounded-full bg-indigo-300 shadow-2xl">
            <button
              type="button"
              style={{
                background: "linear-gradient(to right, #667eea, #764ba2)", // Gradient from indigo to purple
              }}
              className="rounded-md w-72 h-12 text-sm text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Start Streaming Together
            </button>
          </div>
        </div>
        <ChoosePlatform />
      </div>
    </>
  );
}
