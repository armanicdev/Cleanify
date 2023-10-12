// Function to show a specific page and hide others
function showPage(pageId) {
  const pages = document.querySelectorAll('.page');
  const pageToShow = document.getElementById(pageId);

  if (!pageToShow) {
    return; // Return if the specified page is not found
  }

  // Hide all pages
  pages.forEach((page) => {
    page.style.opacity = '0';
    page.style.pointerEvents = 'none';
    page.style.position = 'absolute';
  });

  // Show the specified page
  pageToShow.style.display = 'block';
  pageToShow.style.opacity = '1';
  pageToShow.style.pointerEvents = 'auto';
  pageToShow.style.position = 'relative';
}

document.addEventListener('DOMContentLoaded', () => {
  // DOM elements
  const startButton = document.getElementById('startButton');
  const stopButton = document.getElementById('stopButton');
  const messageElement = document.getElementById('message');
  const backButton = document.getElementById('backButton');
  const gridItems = document.querySelectorAll('.grid-item');

  // Function to set message text
  const setMessageText = (text) => {
    messageElement.textContent = text;
  };

  // Function to toggle start and stop buttons based on their enable status
  const toggleButtons = (startEnabled, stopEnabled) => {
    console.log('Toggle buttons called with:', startEnabled, stopEnabled);
    startButton.classList.toggle('disabled', !startEnabled);
    stopButton.classList.toggle('disabled', !stopEnabled);
  };

  // Function to check if the URL is a YouTube feed tab
  function isYouTubeFeedTab(url) {
    return url.startsWith('https://www.youtube.com/feed/channels');
  }

  // Click event listeners for grid items
  gridItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      if (index === 0) {
        showPage('page1');
        chrome.storage.local.set({ activePage: 'page1' });
      }
    });
  });

  // Click event listener for the back button
  backButton.addEventListener('click', () => {
    showPage('defaultPage');
    chrome.storage.local.set({ activePage: 'defaultPage' });
  });

  // Event listener for the window unload event
  window.addEventListener('beforeunload', resetExtension);
  resetExtension();

  // Event listener for the tab activation event
  chrome.tabs.onActivated.addListener(({ tabId }) => {
    checkYouTubeTab(tabId);
  });

  // Click event listener for the start button
  startButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([activeTab]) => {
      if (isYouTubeFeedTab(activeTab?.url)) {
        chrome.tabs.sendMessage(activeTab.id, { action: 'startUnsubscribe' });
        toggleButtons(false, true);
        chrome.storage.local.set({ startButtonEnabled: false, stopButtonEnabled: true });
      } else {
        setMessageText('Please go to YouTube > Subscription > Manage to continue');
      }
    });
  });

  // Click event listener for the stop button
  stopButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([activeTab]) => {
      if (!stopButton.classList.contains('disabled')) {
        chrome.tabs.sendMessage(activeTab.id, { action: 'stopUnsubscribe' });
        toggleButtons(true, false);
        chrome.storage.local.set({ startButtonEnabled: true, stopButtonEnabled: false });
      }
    });
  });

  // Get stored button enable status and update button states
  chrome.storage.local.get(['startButtonEnabled', 'stopButtonEnabled'], ({ startButtonEnabled, stopButtonEnabled }) => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([activeTab]) => {
      const url = activeTab?.url || '';
      const isYouTubeTab = isYouTubeFeedTab(url);

      if (isYouTubeTab && url.startsWith('https://www.youtube.com/feed/channels')) {
        toggleButtons(startButtonEnabled !== false, stopButtonEnabled === true);
      } else {
        toggleButtons(false, false);
      }
    });
  });
});

// Function to reset the extension state
function resetExtension() {
  chrome.storage.local.get(['activePage', 'startButtonEnabled', 'stopButtonEnabled'], ({ activePage, startButtonEnabled, stopButtonEnabled }) => {
    const pageToShow = activePage || 'defaultPage';
    showPage(pageToShow);
    toggleButtons(startButtonEnabled || false, stopButtonEnabled || false);
  });
}

// Function to check if the given tab is a YouTube feed tab
function checkYouTubeTab(tabId) {
  chrome.tabs.get(tabId, (tab) => {
    if (tab) {
      const url = tab.url || '';
      if (isYouTubeFeedTab(url)) {
        // Additional logic for YouTube feed tab if needed
      }
    }
  });
}
