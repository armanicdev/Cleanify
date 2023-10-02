// Function to display a specific page by its ID
function showPage(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach((page) => {
    page.style.display = 'none';
  });

  const pageToShow = document.getElementById(pageId);
  pageToShow.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function () {
  // Select elements from the DOM
  const gridItems = document.querySelectorAll('.grid-item'); // Add back grid items
  const backButton = document.getElementById('backButton');
  const startButton = document.getElementById('startButton');
  const stopButton = document.getElementById('stopButton');
  const messageElement = document.getElementById('message');

  // Add click event listeners to grid items
  gridItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      if (index === 0) {
        showPage('page1');
        chrome.storage.local.set({ activePage: 'page1' });
      }
    });
  });

  // Add click event listener to the back button
  backButton.addEventListener('click', () => {
    showPage('defaultPage');
    chrome.storage.local.set({ activePage: 'defaultPage' });
  });

  // Function to reset the extension's active page
  function resetExtension() {
    chrome.storage.local.get('activePage', function (result) {
      const activePage = result.activePage || 'defaultPage';
      showPage(activePage);
    });
  }

  // Add a beforeunload event listener to reset the extension
  window.addEventListener('beforeunload', () => {
    resetExtension();
  });

  // Initialize the extension page
  resetExtension();

  // Function to set the message text
  function setMessageText(text) {
    messageElement.textContent = text;
  }

  // Function to toggle button states
  function toggleButtons(startEnabled, stopEnabled) {
    startButton.disabled = !startEnabled;
    stopButton.disabled = !stopEnabled;
  }

  // Function to check if a URL is a YouTube Manage page
  function isYouTubeManagePage(url) {
    return url.startsWith('https://www.youtube.com/') && url.includes('/feed/channels');
  }

  // Add click event listener to the start button
  startButton.addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      if (isYouTubeManagePage(activeTab.url)) {
        chrome.tabs.sendMessage(activeTab.id, { action: 'startUnsubscribe' });
        toggleButtons(false, true);
      }
      else {
        setMessageText('Please go to YouTube > Subscription > Manage to continue');
      }
    });
  });

  // Add click event listener to the stop button
  stopButton.addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { action: 'stopUnsubscribe' });
      toggleButtons(true, false);
    });
  });
});
