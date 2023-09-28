document.addEventListener('DOMContentLoaded', function() {
  const startButton = document.getElementById('startButton');
  const stopButton = document.getElementById('stopButton');
  const messageElement = document.getElementById('message');

  function setMessageText(text) {
    messageElement.textContent = text;
  }

  function toggleButtons(startEnabled, stopEnabled) {
    startButton.disabled = !startEnabled;
    stopButton.disabled = !stopEnabled;
  }

  function isYouTubeManagePage(url) {
    return url.startsWith('https://www.youtube.com/') && url.includes('/feed/channels');
  }

  function checkYouTubeTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const activeTab = tabs[0];
      if (isYouTubeManagePage(activeTab.url)) {
        setMessageText('This extension is for bulk unsubscribing YouTube channels.');
        toggleButtons(true, false);
      } else {
        setMessageText('Please go to YouTube > Subscription > Manage to continue');
        toggleButtons(false, false);
      }
    });
  }

  startButton.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const activeTab = tabs[0];
      if (isYouTubeManagePage(activeTab.url)) {
        chrome.tabs.sendMessage(activeTab.id, { action: 'startUnsubscribe' });
        toggleButtons(false, true);
      } else {
        setMessageText('Please go to YouTube > Subscription > Manage to continue');
      }
    });
  });

  stopButton.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { action: 'stopUnsubscribe' });
      toggleButtons(true, false);
    });
  });

  checkYouTubeTab();
});
