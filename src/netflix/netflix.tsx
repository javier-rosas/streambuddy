import { useEffect, useState } from "react";

type MessageType = {
  type: string;
  payload: {
    status: string;
    time: number;
  };
};

const Netflix = () => {
  const [videoStatus, setVideoStatus] = useState<string | null>(null);
  const [videoTime, setVideoTime] = useState<number | null>(null);

  useEffect(() => {
    const handleMessage = (
      message: MessageType,
      _sender: chrome.runtime.MessageSender,
      _sendResponse: Function
    ) => {
      if (message.type === "VIDEO_STATUS_CHANGE") {
        setVideoStatus(message.payload.status);
        setVideoTime(message.payload.time);
      }
    };

    // Add message listener
    chrome.runtime.onMessage.addListener(handleMessage);

    // Request any cached status from the background script

    /**
     * TODO: maybe delete REQUEST_CACHED_STATUS
     * **/
    chrome.runtime.sendMessage({ type: "REQUEST_CACHED_STATUS" });

    // Cleanup function to remove the message listener
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }, []);

  console.log("videoStatus", videoStatus);
  console.log("videoTime", videoTime);
  return (
    <div>
      <p>Video Status: {videoStatus}</p>
      <p>Video Time: {videoTime}</p>
    </div>
  );
};

export default Netflix;
