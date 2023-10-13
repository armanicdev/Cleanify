let stopUnsubscribe = false;
let unsubscribeInterval;

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'startUnsubscribe') {
    console.log("Started unsubscribing");
    stopUnsubscribe = false;
    startUnsubscribe();
  } else if (message.action === 'stopUnsubscribe') {
    console.log("Stopped unsubscribing");
    stopUnsubscribe = true;
    clearInterval(unsubscribeInterval);
  }
});

function startUnsubscribe() {
  i = 0; // Reset the counter
  unsubscribeInterval = setInterval(unsubscribeChannel, 500);
}

function unsubscribeChannel() {
  if (stopUnsubscribe) {
    clearInterval(unsubscribeInterval);
    console.log("Unsubscribe process stopped");
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
        }
      }, 300);

      i++;
      console.log(`${i} unsubscribed`);
      console.log(`${channelCount - i} remaining`);
    }
  } else {
    clearInterval(unsubscribeInterval);
    console.log("Unsubscribe process completed");
  }
}