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
  const startButton3 = document.getElementById('startButton3');
  const stopButton3 = document.getElementById('stopButton3');
  const startButton4 = document.getElementById('startButton4');
  const stopButton4 = document.getElementById('stopButton4');

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

  const toggleButtons3 = (startEnabled, stopEnabled) => {
    startButton3.classList.toggle('disabled', !startEnabled);
    stopButton3.classList.toggle('disabled', !stopEnabled);
  };

  const toggleButtons4 = (startEnabled, stopEnabled) => {
    startButton4.classList.toggle('disabled', !startEnabled);
    stopButton4.classList.toggle('disabled', !stopEnabled);
  };

  toggleButtons4(false, false);

  function isYouTubeFeedTab(url) {
    return url.startsWith('https://www.youtube.com/feed/channels');
  }

  function isYouTubeLikeTab(url) {
    return url.startsWith('https://www.youtube.com/playlist?list=LL');
  }

  function isYouTubeWatchTab(url) {
    return url.startsWith('https://www.youtube.com/playlist?list=WL');
  }


  const handleGridItemClick = (index) => {
    const pageId = `page${index + 1}`;
    showPage(pageId);
    chrome.storage.local.set({ activePage: pageId });
  };

  gridItems.forEach((item, index) => {
    item.addEventListener('click', () => handleGridItemClick(index));
  });

  const handleBackButtonClick = () => {
    showPage('defaultPage');
    chrome.storage.local.set({ activePage: 'defaultPage' });
  };

  backButton.addEventListener('click', handleBackButtonClick);
  backButton2.addEventListener('click', handleBackButtonClick);
  backButton3.addEventListener('click', handleBackButtonClick);
  backButton4.addEventListener('click', handleBackButtonClick);

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
        chrome.tabs.sendMessage(activeTab.id, { action: 'startDislike', tabId: activeTab.id });
        toggleButtons2(false, true);
        chrome.storage.local.set({ startButton2Enabled: false, stopButton2Enabled: true });
      } else {
      }
    });
  });

  stopButton2.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([activeTab]) => {
      if (!stopButton2.classList.contains('disabled')) {
        chrome.tabs.sendMessage(activeTab.id, { action: 'stopDislike', tabId: activeTab.id });
        toggleButtons2(true, false);
        chrome.storage.local.set({ startButton2Enabled: true, stopButton2Enabled: false });
      }
    });
  });

  startButton3.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([activeTab]) => {
      if (isYouTubeWatchTab(activeTab?.url)) {
        // Your logic for the new action on page3
        chrome.tabs.sendMessage(activeTab.id, { action: 'startNewAction', tabId: activeTab.id });
        toggleButtons3(false, true);
        chrome.storage.local.set({ startButton3Enabled: false, stopButton3Enabled: true });
      } else {
      }
    });
  });

  stopButton3.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([activeTab]) => {
      if (!stopButton3.classList.contains('disabled')) {
        // Your logic to stop the new action on page3
        chrome.tabs.sendMessage(activeTab.id, { action: 'stopNewAction', tabId: activeTab.id });
        toggleButtons3(true, false);
        chrome.storage.local.set({ startButton3Enabled: true, stopButton3Enabled: false });
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

  chrome.storage.local.get(['startButton3Enabled', 'stopButton3Enabled'], ({ startButton3Enabled, stopButton3Enabled }) => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([activeTab]) => {
      const url = activeTab?.url || '';
      const isWatchTab = isYouTubeWatchTab(url);

      if (isWatchTab && url.startsWith('https://www.youtube.com/playlist?list=WL')) {
        toggleButtons3(startButton3Enabled !== false, stopButton3Enabled === true);
      } else {
        toggleButtons3(false, false);
      }
    });
  });
});


function resetExtension() {
  chrome.storage.local.get(['activePage', 'startButtonEnabled', 'stopButtonEnabled'], ({ activePage, startButtonEnabled, stopButtonEnabled }) => {
    const pageToShow = activePage || 'defaultPage';
    showPage(pageToShow);
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