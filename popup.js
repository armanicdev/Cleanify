function showPage(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => (page.style.display = 'none'));
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

  const setMessageText = text => {
    messageElement.textContent = text;
  };

  const resetExtension = () => {
    chrome.storage.local.get('activePage', ({ activePage }) => {
      const pageToShow = activePage || 'defaultPage';
      showPage(pageToShow);
    });
  };

  const isYouTubeFeedTab = url => {
    return url.startsWith('https://www.youtube.com/feed/channels');
  };

  const toggleButtons = (startEnabled, stopEnabled) => {
    if (startEnabled) {
      startButton.classList.remove('disabled');
    } else {
      startButton.classList.add('disabled');
    }

    if (stopEnabled) {
      stopButton.classList.remove('disabled');
    } else {
      stopButton.classList.add('disabled');
    }
  };


  const checkYouTubeTab = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([activeTab]) => {
      toggleButtons(isYouTubeFeedTab(activeTab?.url), false);
    });
  };

  checkYouTubeTab();

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

  startButton.addEventListener('click', () => {
    if (!startButton.classList.contains('disabled')) {
      chrome.tabs.query({ active: true, currentWindow: true }, ([activeTab]) => {
        if (isYouTubeFeedTab(activeTab?.url)) {
          chrome.tabs.sendMessage(activeTab.id, { action: 'startUnsubscribe' });
          toggleButtons(false, true);
        } else {
          setMessageText('Please go to YouTube > Subscription > Manage to continue');
        }
      });
    }
  });

  stopButton.addEventListener('click', () => {
    if (!stopButton.classList.contains('disabled')) {
      chrome.tabs.query({ active: true, currentWindow: true }, ([activeTab]) => {
        chrome.tabs.sendMessage(activeTab.id, { action: 'stopUnsubscribe' });
        toggleButtons(true, false);
      });
    }
  });
});