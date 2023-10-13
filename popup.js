function showPage(pageId) {
  const pages = document.querySelectorAll('.page');
  const pageToShow = document.getElementById(pageId);

  if (!pageToShow) {
    return;
  }

  pages.forEach((page) => {
    page.style.opacity = '0';
    page.style.pointerEvents = 'none';
    page.style.position = 'absolute';
  });

  pageToShow.style.display = 'block';
  pageToShow.style.opacity = '1';
  pageToShow.style.pointerEvents = 'auto';
  pageToShow.style.position = 'relative';
}

document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('startButton');
  const stopButton = document.getElementById('stopButton');
  const messageElement = document.getElementById('message');
  const backButton = document.getElementById('backButton');
  const gridItems = document.querySelectorAll('.grid-item');
  const startButton2 = document.getElementById('startButton2');
  const stopButton2 = document.getElementById('stopButton2');

  const setMessageText = (text) => {
    messageElement.textContent = text;
  };

  const toggleButtons = (startEnabled, stopEnabled) => {
    startButton.classList.toggle('disabled', !startEnabled);
    stopButton.classList.toggle('disabled', !stopEnabled);
  };

  const toggleButtons2 = (startEnabled, stopEnabled) => {
    startButton2.classList.toggle('disabled', !startEnabled);
    stopButton2.classList.toggle('disabled', !stopEnabled);
  };

  function isYouTubeFeedTab(url) {
    return url.startsWith('https://www.youtube.com/feed/channels');
  }

  function isYouTubeLikeTab(url) {
    return url.startsWith('https://www.youtube.com/playlist?list=LL');
  }

  gridItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      if (index === 0) {
        showPage('page1');
        chrome.storage.local.set({ activePage: 'page1' });
      } else if (index === 1) {
        showPage('page2');
        chrome.storage.local.set({ activePage: 'page2' });
      } else if (index === 2) {
        showPage('page3');
        chrome.storage.local.set({ activePage: 'page3' });
      } else if (index === 3) {
        showPage('page4');
        chrome.storage.local.set({ activePage: 'page4' });
      }
    });
  });

  backButton.addEventListener('click', () => {
    showPage('defaultPage');
    chrome.storage.local.set({ activePage: 'defaultPage' });
  });

  const backButton2 = document.getElementById('backButton2');
  backButton2.addEventListener('click', () => {
    showPage('defaultPage');
    chrome.storage.local.set({ activePage: 'defaultPage' });
  });

  const backButton3 = document.getElementById('backButton3');
  backButton3.addEventListener('click', () => {
    showPage('defaultPage');
    chrome.storage.local.set({ activePage: 'defaultPage' });
  });

  const backButton4 = document.getElementById('backButton4');
  backButton4.addEventListener('click', () => {
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
      if (!stopButton.classList.contains('disabled')) {
        chrome.tabs.sendMessage(activeTab.id, { action: 'stopUnsubscribe' });
        toggleButtons(true, false);
        chrome.storage.local.set({ startButtonEnabled: true, stopButtonEnabled: false });
      }
    });
  });

  startButton2.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, async ([activeTab]) => {
      if (isYouTubeLikeTab(activeTab?.url)) {
        chrome.runtime.sendMessage({ action: 'startDislike' }); // Send message to background.js
        toggleButtons2(false, true);
        chrome.storage.local.set({ startButton2Enabled: false, stopButton2Enabled: true });
      } else {
        setMessageText('Please go to the specified YouTube playlist to continue');
      }
    });
  });


  stopButton2.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([activeTab]) => {
      if (!stopButton2.classList.contains('disabled')) {
        chrome.tabs.sendMessage(activeTab.id, { action: 'stopDislike' });
        toggleButtons2(true, false);
        chrome.storage.local.set({ startButton2Enabled: true, stopButton2Enabled: false });
      }
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

  chrome.storage.local.get(['startButton2Enabled', 'stopButton2Enabled'], ({ startButton2Enabled, stopButton2Enabled }) => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([activeTab]) => {
      const url = activeTab?.url || '';
      const isLikeTab = isYouTubeLikeTab(url);

      if (isLikeTab && url.startsWith('https://www.youtube.com/playlist?list=LL')) {
        toggleButtons2(startButton2Enabled === true, stopButton2Enabled === true);  // Enable startButton2 when on the specified link
      } else {
        toggleButtons2(false, false);
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