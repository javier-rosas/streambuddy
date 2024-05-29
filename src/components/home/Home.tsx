import { getJwtToken, getUserData, logout } from "@/utils/userUtils.js";

import ChoosePlatform from "./ChoosePlatform";
import Spinner from "@/components/random/Spinner";
import { VITE_API_JOIN_ENDPOINT } from "@/utils/constants";
import { createSession } from "@/services/session";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Home() {
  const navigate = useNavigate();
  const [isSpinning, setIsSpinning] = useState(false);
  const [link, setLink] = useState(null);
  const [copied, setCopied] = useState(false);

  const user = getUserData();
  const jwt = getJwtToken();

  const getLink = async () => {
    if (!user || !user.email || !jwt) return;
    try {
      const session = await createSession(jwt, user.email);
      if (!session || !session.link) return;
      console.log("session", session.link);
      setLink(session.link);
      return session.link;
    } catch (error) {
      console.error("Failed to get link", error);
    }
  };

  const handleButtonClick = async () => {
    setIsSpinning(true);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for 0.5 seconds
    await getLink();
    chrome.runtime.sendMessage({ type: "startStream", link });
    setIsSpinning(false);
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(`${VITE_API_JOIN_ENDPOINT}/${link}`)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 500); // Reset the copied state after 0.5 seconds
      });
  };

  // useEffect(() => {
  //   getLink();
  // }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => logout(navigate)}
        className="absolute top-4 right-4 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        Sign Out
      </button>

      <div className="flex flex-col items-center justify-center mt-16 bg-transparent">
        {isSpinning ? (
          <Spinner />
        ) : link ? (
          <div
            className="flex items-center m-4 border border-indigo-500 rounded p-2 bg-indigo-100 cursor-pointer"
            onClick={handleCopy}
          >
            {copied ? (
              <p className="text-black text-xs">Copied!</p>
            ) : (
              <p className="text-black text-xs mr-2">
                {`${VITE_API_JOIN_ENDPOINT}/${link}`}
              </p>
            )}

            {!copied && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#0c0a09"
                className="w-6 h-6"
                style={{ background: "transparent" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                />
              </svg>
            )}
          </div>
        ) : (
          <div className="mb-8">
            <div className="mx-auto flex items-center justify-center rounded-full bg-indigo-300 shadow-2xl">
              <button
                onClick={handleButtonClick}
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
        )}
      </div>
      <ChoosePlatform />
    </>
  );
}
