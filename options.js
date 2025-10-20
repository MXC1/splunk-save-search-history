// Hard-coded URL and CSS selector
const url = "https://nhsdigital.splunkcloud.com/en-GB/app/search/search";
const selector = ".ace_text-input";

console.log("Sending message to get input history for URL:", url, "and selector:", selector);

chrome.runtime.sendMessage(
  { type: "getInputHistory", url, selector },
  (response) => {
    console.log("Received response:", response);
    const historyList = document.getElementById("history-list");
    historyList.innerHTML = "";

    if (response.length === 0) {
      console.log("No input history found.");
    }

    response.forEach((entry, idx) => {
      const li = document.createElement("li");
      li.className = `history-item ${idx % 2 === 0 ? 'even' : 'odd'}`;

      // Timestamp
      const ts = document.createElement("span");
      ts.className = "timestamp";
      ts.textContent = entry.timestamp;
      li.appendChild(ts);

      // Input (with line breaks)
      const inputDiv = document.createElement("div");
      inputDiv.innerHTML = entry.input.replace(/\n/g, "<br>");
      li.appendChild(inputDiv);

      historyList.appendChild(li);
    });
  }
);

// Add event listener for the Clear button
document.getElementById("clear-history").addEventListener("click", () => {
  chrome.storage.local.clear(() => {
    console.log("History cleared.");
    const historyList = document.getElementById("history-list");
    historyList.innerHTML = "";
  });
});
