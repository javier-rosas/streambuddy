type MovieSessions = Set<string>;

export function getQueryParameter(name: string) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Function to extract the code from Netflix watch URL
function extractCodeFromNetflixUrl(url: string): string | null {
  const match = url.match(/https:\/\/www\.netflix\.com\/watch\/(\d+)/);
  return match ? match[1] : null;
}

function extractBaseNetflixUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return `${urlObj.origin}${urlObj.pathname}`;
  } catch (error) {
    console.error("Invalid URL:", error);
    return "";
  }
}

// Function to handle URL changes
export function handleUrlChange(
  socket: any,
  sessionCode: string | null,
  movieSessions: MovieSessions
) {
  if (!sessionCode) return;
  const currentUrl = window.location.href;
  const code = extractCodeFromNetflixUrl(currentUrl);
  const url = extractBaseNetflixUrl(currentUrl);
  if (code && url) {
    // concatenate code to currentUrl
    const sessionCodeAndUrl = `${url}/${code}`;

    if (movieSessions.has(sessionCodeAndUrl)) {
      console.log("Movie already being watched");
      return;
    }

    movieSessions.add(sessionCodeAndUrl);
    console.log("Extracted code:", code);
    // Add any additional logic you want to perform with the extracted code
    socket.emit("go-to-movie", {
      sessionCode: sessionCode,
      link: url,
    });
  }
}
