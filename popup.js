document.addEventListener('DOMContentLoaded', function () {
  // Select important elements on the popup HTML
  const pages = document.querySelectorAll('.page');
  const gridItems = document.querySelectorAll('.grid-item');
  const backButton = document.getElementById('backButton');
  const startButton = document.getElementById('startButton');
  const stopButton = document.getElementById('stopButton');
  const messageElement = document.getElementById('message');

  // Function to show a specific page and hide others
  function showPage(pageId) {
    // Hide all pages
    pages.forEach((page) => {
      page.style.display = 'none';
    });

    // Show the selected page
    const pageToShow = document.getElementById(pageId);
    pageToShow.style.display = 'block';
  }

  // Event listener for grid items to navigate to respective pages
  gridItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      if (index === 0) {
        // Handle the first grid item, customize for others
        showPage('page1');

        // Store the active page in Chrome storage
        chrome.storage.local.set({ activePage: 'page1' });
      }
    });
  });

  // Event listener for the back button
  backButton.addEventListener('click', () => {
    // Show the default page when the back button is clicked
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

  // Event listener for when the extension popup is closed
  window.addEventListener('beforeunload', () => {
    // Reset the extension state when the popup is closed
    resetExtension();
  });

  // Initially show the last active page
  resetExtension();

  // Functions from your second code snippet

  // Function to set the message text in the popup
  function setMessageText(text) {
    messageElement.textContent = text;
  }

  // Function to toggle the start and stop buttons
  function toggleButtons(startEnabled, stopEnabled) {
    startButton.disabled = !startEnabled;
    stopButton.disabled = !stopEnabled;
  }

  // Function to check if the current tab is a YouTube Manage page
  function isYouTubeManagePage(url) {
    return url.startsWith('https://www.youtube.com/') && url.includes('/feed/channels');
  }

  // Function to store the extension state in Chrome storage
  function setExtensionState(state) {
    chrome.storage.local.set({ extensionState: state });
  }

  // Function to get the extension state from Chrome storage
  function getExtensionState(callback) {
    chrome.storage.local.get('extensionState', function (result) {
      const state = result.extensionState || 'stopped'; // Default state is 'stopped'
      callback(state);
    });
  }

  // Event listener for the start button
  startButton.addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      if (isYouTubeManagePage(activeTab.url)) {
        chrome.tabs.sendMessage(activeTab.id, { action: 'startUnsubscribe' });
        toggleButtons(false, true);

        // Set the extension state to 'started'
        setExtensionState('started');
      } else {
        setMessageText('Please go to YouTube > Subscription > Manage to continue');
      }
    });
  });

  // Event listener for the stop button
  stopButton.addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { action: 'stopUnsubscribe' });
      toggleButtons(true, false);

      // Set the extension state to 'stopped'
      setExtensionState('stopped');
    });
  });

  // Function to initialize the extension state
  function initializeExtensionState() {
    getExtensionState(function (state) {
      if (state === 'started') {
        // Extension was started previously, enable the stop button
        toggleButtons(false, true);
      } else {
        // Extension was stopped or is in the default state, enable the start button
        toggleButtons(true, false);
      }
    });
  }

  // Initialize the extension state
  initializeExtensionState();
});
