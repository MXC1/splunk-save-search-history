//console.log("Content script loaded");

// Function to add a submit listener to the form containing the target textarea
function addSubmitListenerToForm(form) {
  if (!form) return;

  //console.log("Adding submit listener to form:", form);

  // Add a submit event listener
  form.addEventListener("submit", (event) => {
    //console.log("Form submit event triggered");
    setTimeout(() => {
      // Fetch the contents of ace_text-layer
      const textLayer = document.querySelector(".ace_text-layer");
      let textLayerContent = "";
      if (textLayer) {
        textLayerContent = Array.from(textLayer.querySelectorAll(".ace_line"))
          .map(line => line.textContent)
          .join("\n");
        //console.log("Text layer content with line breaks:", textLayerContent);
      }

      // Send the input and text layer content to the background script for storage
      chrome.runtime.sendMessage({
        type: "saveInput",
        url: window.location.href,
        selector: ".ace_text-input",
        input: textLayerContent,
        textLayerContent: textLayerContent
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error sending message:", chrome.runtime.lastError);
        } else {
          //console.log("Message sent to background script, response:", response);
        }
      });
    }, 0);
  });
}

// Function to add a click listener to the search button
function addClickListenerToButton(button) {
  if (!button) return;

  //console.log("Adding click listener to button:", button);

  // Add a click event listener
  button.addEventListener("click", (event) => {
    //console.log("Search button click event triggered");
    setTimeout(() => {
      // Fetch the contents of ace_text-layer
      const textLayer = document.querySelector(".ace_text-layer");
      let textLayerContent = "";
      if (textLayer) {
        textLayerContent = Array.from(textLayer.querySelectorAll(".ace_line"))
          .map(line => line.textContent)
          .join("\n");
        //console.log("Text layer content with line breaks:", textLayerContent);
      }

      // Send the input and text layer content to the background script for storage
      chrome.runtime.sendMessage({
        type: "saveInput",
        url: window.location.href,
        selector: ".ace_text-input",
        input: textLayerContent,
        textLayerContent: textLayerContent
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error sending message:", chrome.runtime.lastError);
        } else {
          //console.log("Message sent to background script, response:", response);
        }
      });
    }, 0);
  });
}

// Function to add a keydown listener to the textarea to handle the Enter key
function addKeydownListenerToTextArea(textArea) {
  if (!textArea) return;

  //console.log("Adding keydown listener to textarea:", textArea);

  // Add a keydown event listener
  textArea.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      //console.log("Enter key pressed in textarea");
      setTimeout(() => {
        // Fetch the contents of ace_text-layer
        const textLayer = document.querySelector(".ace_text-layer");
        let textLayerContent = "";
        if (textLayer) {
          textLayerContent = Array.from(textLayer.querySelectorAll(".ace_line"))
            .map(line => line.textContent)
            .join("\n");
          //console.log("Text layer content with line breaks:", textLayerContent);
        }

        // Send the input and text layer content to the background script for storage
        chrome.runtime.sendMessage({
          type: "saveInput",
          url: window.location.href,
          selector: ".ace_text-input",
          input: textLayerContent,
          textLayerContent: textLayerContent
        }, (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error sending message:", chrome.runtime.lastError);
          } else {
            //console.log("Message sent to background script, response:", response);
          }
        });
      }, 0);
    }
  });
}

// Function to find and process the form containing the textarea
function processForm() {
  const form = document.querySelector(".search-form");
  if (form) {
    //console.log("Target form found:", form);
    addSubmitListenerToForm(form);
  } else {
    console.warn("Target form with class `.search-form` not found on this page.");
  }
}

// Function to find and process the search button
function processButton() {
  const button = document.querySelector(".btn[aria-label='Search Button']");
  if (button) {
    //console.log("Target button found:", button);
    addClickListenerToButton(button);
  } else {
    console.warn("Target button with aria-label 'Search Button' not found on this page.");
  }
}

// Function to find and process the textarea
function processTextArea() {
  const textArea = document.querySelector(".ace_text-input");
  if (textArea) {
    //console.log("Target textarea found:", textArea);
    addKeydownListenerToTextArea(textArea);
  } else {
    console.warn("Target textarea with class `.ace_text-input` not found on this page.");
  }
}

// Run the script on initial page load
document.addEventListener("DOMContentLoaded", () => {
  //console.log("DOMContentLoaded event fired.");
  processForm();
  processButton();
  processTextArea();
});

// Handle dynamic page content
const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      // Check for newly added nodes
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const newForm = node.querySelector?.(".search-form") || 
                          (node.classList?.contains("search-form") ? node : null);
          if (newForm) {
            //console.log("Dynamically added form found:", newForm);
            addSubmitListenerToForm(newForm);
          }
          const newButton = node.querySelector?.(".btn[aria-label='Search Button']") || 
                            (node.classList?.contains("btn") && node.getAttribute("aria-label") === "Search Button" ? node : null);
          if (newButton) {
            //console.log("Dynamically added button found:", newButton);
            addClickListenerToButton(newButton);
          }
          const newTextArea = node.querySelector?.(".ace_text-input") || 
                              (node.classList?.contains("ace_text-input") ? node : null);
          if (newTextArea) {
            //console.log("Dynamically added textarea found:", newTextArea);
            addKeydownListenerToTextArea(newTextArea);
          }
        }
      });
    }
  }
});

// Start observing the entire document for dynamic changes
observer.observe(document.body, { childList: true, subtree: true });
