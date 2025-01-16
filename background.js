chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

function formatTimestamp(date) {
  const pad = (num) => String(num).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in background:", message);

  if (message.type === "saveInput") {
    const { url, selector, input } = message;
    console.log("Saving input:", { url, selector, input });

    const key = "splunksave";
    chrome.storage.local.get([key], (result) => {
      const history = result[key] || [];
      history.push({ timestamp: formatTimestamp(new Date()), input });
      chrome.storage.local.set({ [key]: history }, () => {
        console.log("Input saved:", history);
        sendResponse({ status: "success" });
      });
    });
    return true; // Indicate that sendResponse will be called asynchronously
  } else if (message.type === "getInputHistory") {
    const { url, selector } = message;
    const key = "splunksave";
    console.log("Retrieving input history for key:", key);
    chrome.storage.local.get([key], (result) => {
      console.log("Retrieved input history:", result[key]);
      sendResponse(result[key] || []);
    });
    return true; // Indicate that sendResponse will be called asynchronously
  }
});
