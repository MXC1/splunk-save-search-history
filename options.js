// Hard-coded URL and CSS selector
const url = "https://nhsdigital.splunkcloud.com/en-GB/app/search/search";
const selector = ".ace_text-input";



let allHistory = [];

function getFilteredHistory() {
  const startDate = document.getElementById("start-date").value;
  const endDate = document.getElementById("end-date").value;
  const searchTerm = document.getElementById("search-bar").value.trim().toLowerCase();

  // Parse dates
  const start = startDate ? new Date(startDate + "T00:00:00") : null;
  const end = endDate ? new Date(endDate + "T23:59:59") : null;

  return allHistory.filter(entry => {
    // Date filter
    let entryDate = new Date(entry.timestamp);
    if (isNaN(entryDate)) {
      entryDate = new Date(entry.timestamp.replace(/\s/, 'T'));
    }
    if (start && entryDate < start) return false;
    if (end && entryDate > end) return false;
    // Search filter
    if (searchTerm && !entry.input.toLowerCase().includes(searchTerm)) return false;
    return true;
  });
}

function renderHistory(filteredHistory) {
  const historyList = document.getElementById("history-list");
  historyList.innerHTML = "";
  if (filteredHistory.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No input history found for the selected filters.";
    li.style.color = "#888";
    li.style.fontStyle = "italic";
    historyList.appendChild(li);
    return;
  }
  filteredHistory.forEach((entry, idx) => {
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

function updateFilters() {
  renderHistory(getFilteredHistory());
}


chrome.runtime.sendMessage(
  { type: "getInputHistory", url, selector },
  (response) => {
    console.log("Received response:", response);
    allHistory = response || [];
    renderHistory(getFilteredHistory());
  }
);

// Date filter event listeners
document.getElementById("apply-filter").addEventListener("click", updateFilters);
document.getElementById("clear-filter").addEventListener("click", () => {
  document.getElementById("start-date").value = "";
  document.getElementById("end-date").value = "";
  updateFilters();
});

// Search bar event listener (live filtering)
document.getElementById("search-bar").addEventListener("input", updateFilters);

// Add event listener for the Clear button
document.getElementById("clear-history").addEventListener("click", () => {
  chrome.storage.local.clear(() => {
    console.log("History cleared.");
    const historyList = document.getElementById("history-list");
    historyList.innerHTML = "";
  });
});
