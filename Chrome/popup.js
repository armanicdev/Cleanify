function showPage(pageId) {
  const pages = document.querySelectorAll('.page');

  pages.forEach((page) => {
    page.style.opacity = '0';
    page.style.display = page.id === pageId ? 'block' : 'none';
  });

  const pageToShow = document.getElementById(pageId);

  if (pageToShow) {
    setTimeout(() => {
      pageToShow.style.opacity = '1';
      pageToShow.style.pointerEvents = 'auto';
      pageToShow.style.position = 'relative';
    }, 0);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('startButton');
  const stopButton = document.getElementById('stopButton');
  const backButton = document.getElementById('backButton');
  const gridItems = document.querySelectorAll('.grid-item');
  const startButton2 = document.getElementById('startButton2');
  const stopButton2 = document.getElementById('stopButton2');
  const startButton3 = document.getElementById('startButton3');
  const stopButton3 = document.getElementById('stopButton3');
  const stopButton4 = document.getElementById('stopButton4');
  const startButton4 = document.getElementById('startButton4');
  const startButtonCopy4 = document.getElementById('startButtonCopy4');
  const startButtonCopy1 = document.getElementById('startButtonCopy1');
  const startButtonCopy2 = document.getElementById('startButtonCopy2');
  const startButtonCopy3 = document.getElementById('startButtonCopy3');

  function hideButton(button) {
    button.style.display = 'none';
  }

  function showButton(button) {
    button.style.display = 'block';
  }

  const toggleButtons = (startEnabled, stopEnabled) => {
    if (startEnabled) {
      showButton(startButton);
      startButtonCopy1.style.display = 'none';
    } else {
      hideButton(startButton);
    }

    if (stopEnabled) {
      showButton(stopButton);
      startButtonCopy1.style.display = 'none';
    } else {
      hideButton(stopButton);
    }
  };

  const toggleButtons2 = (startEnabled, stopEnabled) => {

    if (startEnabled) {
      showButton(startButton2);
      startButtonCopy2.style.display = 'none';
    } else {
      hideButton(startButton2);
    }

    if (stopEnabled) {
      showButton(stopButton2);
      startButtonCopy2.style.display = 'none';
    } else {
      hideButton(stopButton2);
    }
  };

  const toggleButtons3 = (startEnabled, stopEnabled) => {
    if (startEnabled) {
      showButton(startButton3);
      startButtonCopy3.style.display = 'none';
    } else {
      hideButton(startButton3);
    }

    if (stopEnabled) {
      showButton(stopButton3);
      startButtonCopy3.style.display = 'none';
    } else {
      hideButton(stopButton3);
    }
  };

  const toggleButtons4 = (startEnabled, stopEnabled) => {
    if (startEnabled) {
      showButton(startButton4);
      startButtonCopy4.style.display = 'none';
    } else {
      hideButton(startButton4);
    }

    if (stopEnabled) {
      showButton(stopButton4);
      startButtonCopy4.style.display = 'none';
    } else {
      hideButton(stopButton4);
    }
  };

  function isYouTubeFeedTab(url) {
    return url.startsWith('https://www.youtube.com/feed/channels');
  }

  function isYouTubeLikeTab(url) {
    return url.startsWith('https://www.youtube.com/playlist?list=LL');
  }

  function isYouTubeWatchTab(url) {
    return url.startsWith('https://www.youtube.com/playlist?list=WL');
  }

  function isYouTubeCommentTab(url) {
    return url.startsWith('https://myactivity.google.com/page?hl=');
  }

  const handleGridItemClick = (index) => {
    const pageId = `page${index + 1}`;
    showPage(pageId);
    chrome.storage.local.set({ activePage: pageId });
  };

  gridItems.forEach((item, index) => {
    item.addEventListener('click', () => handleGridItemClick(index));
  });

  const handleBackButtonClick = (event) => {
    event.preventDefault();
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
      }
    });
  });

  startButtonCopy1.addEventListener("click", function () {
    window.open("https://www.youtube.com/feed/channels", "_blank");
    toggleButtons(true, false);
  });

  startButtonCopy2.addEventListener("click", function () {
    window.open("https://www.youtube.com/playlist?list=LL", "_blank");
    toggleButtons2(true, false);
  });

  startButtonCopy3.addEventListener("click", function () {
    window.open("https://www.youtube.com/playlist?list=WL", "_blank");
    toggleButtons3(true, false);
  });

  startButtonCopy4.addEventListener("click", function () {
    window.open("https://www.youtube.com/feed/history/comment_history", "_blank");
    toggleButtons4(true, false);
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
        chrome.tabs.sendMessage(activeTab.id, { action: 'startNewAction', tabId: activeTab.id });
        toggleButtons3(false, true);
        chrome.storage.local.set({ startButton3Enabled: false, stopButton3Enabled: true });
      }
    });
  });

  stopButton3.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([activeTab]) => {
      if (!stopButton3.classList.contains('disabled')) {
        chrome.tabs.sendMessage(activeTab.id, { action: 'stopNewAction', tabId: activeTab.id });
        toggleButtons3(true, false);
        chrome.storage.local.set({ startButton3Enabled: true, stopButton3Enabled: false });
      }
    });
  });

  startButton4.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([activeTab]) => {
      if (isYouTubeCommentTab(activeTab?.url)) {
        chrome.tabs.sendMessage(activeTab.id, { action: 'startComment', tabId: activeTab.id });
        toggleButtons4(false, true);
        chrome.storage.local.set({ startButton4Enabled: false, stopButton4Enabled: true });
      }
    });
  });

  stopButton4.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([activeTab]) => {
      if (!stopButton4.classList.contains('disabled')) {
        chrome.tabs.sendMessage(activeTab.id, { action: 'stopComment', tabId: activeTab.id });
        toggleButtons4(true, false);
        chrome.storage.local.set({ startButton4Enabled: true, stopButton4Enabled: false });
      }
    });
  });

  chrome.storage.local.get(['startButton4Enabled', 'stopButton4Enabled'], ({ startButton4Enabled, stopButton4Enabled }) => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([activeTab]) => {
      const url = activeTab?.url || '';
      if (url.startsWith('https://myactivity.google.com/page?hl=')) {
        toggleButtons4(startButton4Enabled !== false, stopButton4Enabled === true);
      } else {
        toggleButtons4(false, false);
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
        toggleButtons2(startButton2Enabled !== false, stopButton2Enabled === true);
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
  chrome.storage.local.get(['activePage', 'startButtonEnabled', 'stopButtonEnabled'], ({ activePage }) => {
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