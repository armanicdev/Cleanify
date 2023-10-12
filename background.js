chrome.runtime.onMessage.addListener((message, sender) => {
  const isStartOrStopAction = message.action === 'startUnsubscribe' || message.action === 'stopUnsubscribe';
  const isYouTubeTab = sender.tab && sender.tab.url && sender.tab.url.startsWith('https://www.youtube.com/feed/channels');

  if (isStartOrStopAction && isYouTubeTab) {
    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      function: (message) => {
        chrome.runtime.sendMessage(message);
      },
      args: [message],
    });
  }
});
