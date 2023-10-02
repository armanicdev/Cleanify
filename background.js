// Add a listener for messages from the extension
chrome.runtime.onMessage.addListener((message, sender) => {
  // Check if the message action is either 'startUnsubscribe' or 'stopUnsubscribe'
  if (message.action === 'startUnsubscribe' || message.action === 'stopUnsubscribe') {
    // Check if the sender has a tab and a URL that starts with 'http'
    if (sender.tab && sender.tab.url && sender.tab.url.startsWith('http')) {
      // Execute a content script in the sender's tab
      chrome.scripting.executeScript({
        target: { tabId: sender.tab.id },
        function: (message) => {
          // Send the message to the content script
          chrome.runtime.sendMessage(message);
        },
        args: [message], // Pass the original message to the content script
      });
    }
  }
});
