document.addEventListener('DOMContentLoaded', function () {
  const pages = document.querySelectorAll('.page');
  const gridItems = document.querySelectorAll('.grid-item'); // Add back grid items
  const backButton = document.getElementById('backButton');
  const startButton = document.getElementById('startButton');
  const stopButton = document.getElementById('stopButton');
  const messageElement = document.getElementById('message');

  function showPage(pageId) {
    pages.forEach((page) => {
      page.style.display = 'none';
    });

    const pageToShow = document.getElementById(pageId);
    pageToShow.style.display = 'block';
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

  function resetExtension() {
    chrome.storage.local.get('activePage', function (result) {
      const activePage = result.activePage || 'defaultPage';
      showPage(activePage);
    });
  }

  window.addEventListener('beforeunload', () => {
    resetExtension();
  });

  resetExtension();

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

  stopButton.addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { action: 'stopUnsubscribe' });
      toggleButtons(true, false);
    });
  });
});
