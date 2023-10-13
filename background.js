chrome.runtime.onMessage.addListener((message, sender) => {
  console.log('Message received:', message);

  if (message.action === 'startUnsubscribe' || message.action === 'stopUnsubscribe') {
    sendToContentScript(sender.tab.id, message);
  } else if (message.action === 'startDislike' || message.action === 'stopDislike') {
    sendToContentDislikeScript(sender.tab.id, message);
  } else if (message.action === 'startNewAction' || message.action === 'stopNewAction') {
    sendToContentWatchScript(sender.tab.id, message);
  }
});

function sendToContentScript(tabId, message) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    function: (message) => {
      chrome.runtime.sendMessage(message);
    },
    args: [message],
  });
}

function sendToContentDislikeScript(tabId, message) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    function: (message) => {
      chrome.runtime.sendMessage(message);
    },
    args: [message],
  });
}

function sendToContentWatchScript(tabId, message) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    function: (message) => {
      chrome.runtime.sendMessage(message);
    },
    args: [message],
  });
}