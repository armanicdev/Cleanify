chrome.runtime.onMessage.addListener((message, sender) => {
  if (isValidAction(message.action)) {
    sendToContentScript(sender.tab.id, message);
  }
});

function isValidAction(action) {
  return (
    action === 'startUnsubscribe' ||
    action === 'stopUnsubscribe' ||
    action === 'startDislike' ||
    action === 'stopDislike' ||
    action === 'startNewAction' ||
    action === 'stopNewAction'
  );
}

function sendToContentScript(tabId, message) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    function: (message) => {
      chrome.runtime.sendMessage(message);
    },
    args: [message],
  });
}