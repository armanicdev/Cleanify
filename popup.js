document.addEventListener('DOMContentLoaded', function() {
  // Get references to HTML elements
  const startButton = document.getElementById('startButton');
  const stopButton = document.getElementById('stopButton');
  const messageElement = document.getElementById('message');

  // Function to set the text of the message element
  function setMessageText(text) {
    messageElement.textContent = text;
  }

  // Function to enable/disable buttons
  function toggleButtons(startEnabled, stopEnabled) {
    startButton.disabled = !startEnabled;
    stopButton.disabled = !stopEnabled;
  }

  // Check if the current tab is the YouTube manage page
  function isYouTubeManagePage(url) {
    return url.startsWith('https://www.youtube.com/') && url.includes('/feed/channels');
  }

  // Check the current tab on extension load
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

  // Event listener for the start button
  startButton.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const activeTab = tabs[0];
      if (isYouTubeManagePage(activeTab.url)) {
        // Send a message to the content script to start unsubscribing
        chrome.tabs.sendMessage(activeTab.id, { action: 'startUnsubscribe' });
        toggleButtons(false, true);
      } else {
        setMessageText('Please go to YouTube > Subscription > Manage to continue');
      }
    });
  });

  // Event listener for the stop button
  stopButton.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const activeTab = tabs[0];
      // Send a message to the content script to stop unsubscribing
      chrome.tabs.sendMessage(activeTab.id, { action: 'stopUnsubscribe' });
      toggleButtons(true, false);
    });
  });

  // Check the current tab when the extension loads
  checkYouTubeTab();
});
