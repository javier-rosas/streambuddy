chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (
    changeInfo.status === "complete" &&
    tab.url.startsWith("https://your-party-link-domain/")
  ) {
    // Extract the party link details from the URL if needed
    const partyLinkDetails = extractPartyId(tab.url);

    // Send a message to the content script of the active tab
    chrome.tabs.sendMessage(tabId, {
      action: "joinParty",
      details: partyLinkDetails,
    });
  }
});

function extractPartyId(url) {
  // return the thing after the domain/ in the URL
  return url.split("domain/").pop();
}
