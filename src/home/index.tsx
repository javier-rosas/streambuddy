import { clearUserDataAndToken, getUserToken } from "../utils/userUtils.js";

import { CheckIcon } from "@heroicons/react/24/outline";
import { getUserData } from "../utils/userUtils";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const user = getUserData();

  console.log("user", user);

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
      <div className="relative z-10">
        <div className="fixed inset-0 z-10 w-screen">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <CheckIcon
                    className="h-6 w-6 text-green-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">
                    Start Party
                  </h3>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={() => {
                    console.log("hello");
                  }}
                >
                  Go back to dashboard
                </button>
              </div>
            </div>
          </div>
          <button onClick={() => logout()} type="button">
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
