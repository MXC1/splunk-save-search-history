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

    response.forEach((entry) => {
      const li = document.createElement("li");
      li.innerHTML = `[${entry.timestamp}]<br>${entry.input.replace(/\n/g, "<br>")}<br><br>`;
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
