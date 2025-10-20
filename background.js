chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

function formatTimestamp(date) {
  // Format: Mon Oct 20 2025 18:44
  const pad = (num) => String(num).padStart(2, '0');
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const day = pad(date.getDate());
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${dayName} ${monthName} ${day} ${year} ${hours}:${minutes}`;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in background:", message);

  if (message.type === "saveInput") {
    const { url, selector, input } = message;
    console.log("Saving input:", { url, selector, input });

    const key = "splunksave";
    chrome.storage.local.get([key], (result) => {
      let history = result[key] || [];
  // Remove any previous entry with the same input (case sensitive, whitespace insensitive)
  const normalize = str => str.replace(/\s+/g, ' ').trim();
  history = history.filter(entry => normalize(entry.input) !== normalize(input));
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
