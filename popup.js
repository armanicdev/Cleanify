document.addEventListener('DOMContentLoaded', function () {
  const pages = document.querySelectorAll('.page');
  const gridItems = document.querySelectorAll('.grid-item');
  const backButton = document.getElementById('backButton');
  const startButton = document.getElementById('startButton');
  const stopButton = document.getElementById('stopButton');
  const messageElement = document.getElementById('message');

  // Function to show a specific page and hide others
  function showPage(pageId) {
    pages.forEach((page) => {
      page.style.display = 'none';
    });
    const pageToShow = document.getElementById(pageId);
    pageToShow.style.display = 'block';
  }

  // Event listener for grid items to navigate to respective pages
  gridItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      if (index === 0) {
        showPage('page1');
        // Store the active page in Chrome storage
        chrome.storage.local.set({ activePage: 'page1' });
      }
      // Add similar logic for other grid items
    });
  });

  // Event listener for the back button
  backButton.addEventListener('click', () => {
    showPage('defaultPage');
    // Store the active page as defaultPage
    chrome.storage.local.set({ activePage: 'defaultPage' });
  });

  // Function to reset the extension to the default page
  function resetExtension() {
    // Retrieve the active page from Chrome storage
    chrome.storage.local.get('activePage', function (result) {
      const activePage = result.activePage || 'defaultPage';
      showPage(activePage);
    });
  }

  // Event listener for when the extension window is closed
  window.addEventListener('beforeunload', () => {
    // Reset the extension when closing
    resetExtension();
  });

  // Initially show the last active page
  resetExtension();

  // Functions from your second code snippet

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
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
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

  startButton.addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      if (isYouTubeManagePage(activeTab.url)) {
        chrome.tabs.sendMessage(activeTab.id, { action: 'startUnsubscribe' });
        toggleButtons(false, true);
      } else {
        setMessageText('Please go to YouTube > Subscription > Manage to continue');
      }
    });
  });

  stopButton.addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { action: 'stopUnsubscribe' });
      toggleButtons(true, false);
    });
  });

  checkYouTubeTab();
});
