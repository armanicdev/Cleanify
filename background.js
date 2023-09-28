chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.action === 'startUnsubscribe' || message.action === 'stopUnsubscribe') {
    if (sender.tab && sender.tab.url && sender.tab.url.startsWith('http')) {
      chrome.scripting.executeScript({
        target: { tabId: sender.tab.id },
        function: (message) => {
          chrome.runtime.sendMessage(message);
        },
        args: [message],
      });
    }
  }
});
