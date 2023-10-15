// Remove all youtube subscriptions 

let stopUnsubscribe = false;
let unsubscribeInterval;

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'startUnsubscribe') {
    stopUnsubscribe = false;
    startUnsubscribe();
  } else if (message.action === 'stopUnsubscribe') {
    stopUnsubscribe = true;
    clearInterval(unsubscribeInterval);
  }
});

function startUnsubscribe() {
  i = 0;
  unsubscribeInterval = setInterval(unsubscribeChannel, 500);
}

function unsubscribeChannel() {
  if (stopUnsubscribe) {
    clearInterval(unsubscribeInterval);
    return;
  }

  const channelRenderers = Array.from(document.getElementsByTagName('ytd-channel-renderer'));
  const channelCount = channelRenderers.length;

  if (i < channelCount) {
    const unsubscribeButton = channelRenderers[i].querySelector("[aria-label^='Unsubscribe from']");

    if (unsubscribeButton) {
      unsubscribeButton.click();

      setTimeout(() => {
        const confirmButton = document.getElementById('confirm-button').querySelector("[aria-label^='Unsubscribe'");
        if (confirmButton) {
          confirmButton.click();
          const channelToRemove = channelRenderers[i];
          channelToRemove.parentNode.removeChild(channelToRemove);
        }
      }, 300);
    }
  } else {
    clearInterval(unsubscribeInterval);
  }
}