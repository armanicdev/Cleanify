function showPage(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach((page) => (page.style.display = 'none'));
  const pageToShow = document.getElementById(pageId);
  if (pageToShow) {
    pageToShow.style.display = 'block';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('startButton');
  const stopButton = document.getElementById('stopButton');
  const messageElement = document.getElementById('message');
  const backButton = document.getElementById('backButton');
  const gridItems = document.querySelectorAll('.grid-item');

  const setMessageText = (text) => {
    messageElement.textContent = text;
  };

  const toggleButtons = (startEnabled, stopEnabled) => {
    console.log('Toggle buttons called with:', startEnabled, stopEnabled);
    startButton.classList.toggle('disabled', !startEnabled);
    stopButton.classList.toggle('disabled', !stopEnabled);
  };

  function isYouTubeFeedTab(url) {
    return url.startsWith('https://www.youtube.com/feed/channels');
  }

  gridItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      if (index === 0) {
        showPage('page1');
        chrome.storage.local.set({ activePage: 'page1' });
      }
    });
  });

  backButton.addEventListener('click', () => {
    showPage('defaultPage');
    chrome.storage.local.set({ activePage: 'defaultPage' });
  });

  window.addEventListener('beforeunload', resetExtension);
  resetExtension();

  chrome.tabs.onActivated.addListener(({ tabId }) => {
    checkYouTubeTab(tabId);
  });

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

  stopButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([activeTab]) => {
      chrome.tabs.sendMessage(activeTab.id, { action: 'stopUnsubscribe' });
      toggleButtons(true, false);
      chrome.storage.local.set({ startButtonEnabled: true, stopButtonEnabled: false });
    });
  });

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

function resetExtension() {
  chrome.storage.local.get(['activePage', 'startButtonEnabled', 'stopButtonEnabled'], ({ activePage, startButtonEnabled, stopButtonEnabled }) => {
    const pageToShow = activePage || 'defaultPage';
    showPage(pageToShow);
    toggleButtons(startButtonEnabled || false, stopButtonEnabled || false);
  });
}

function checkYouTubeTab(tabId) {
  chrome.tabs.get(tabId, (tab) => {
    if (tab) {
      const url = tab.url || '';
      if (isYouTubeFeedTab(url)) {
      }
    }
  });
}