// Credit: ArmanicYT

const UNSUBSCRIBE_DELAY_TIME = 500;
let isUnsubscribing = false;

async function unsubscribeFromChannels(channels) {
  for (let i = 0; i < channels.length; i++) {
    if (!isUnsubscribing) {
      console.log("Unsubscribe process stopped.");
      break;
    }
    const channel = channels[i];
    const unsubscribeButton = channel.querySelector('[aria-label^="Unsubscribe from"]');

    if (unsubscribeButton) {
      unsubscribeButton.click();
      await new Promise((resolve) => setTimeout(resolve, UNSUBSCRIBE_DELAY_TIME));
      const confirmButton = document.querySelector('yt-confirm-dialog-renderer [aria-label^="Unsubscribe"]');
      if (confirmButton) {
        confirmButton.click();
        console.log(`Unsubscribed ${i + 1}/${channels.length}`);
      }
    }
  }
}

window.addEventListener('load', async () => {
  const channels = Array.from(document.querySelectorAll('ytd-channel-renderer'));
  console.log(`${channels.length} channels found.`);

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'startUnsubscribe' && !isUnsubscribing) {
      isUnsubscribing = true;
      unsubscribeFromChannels(channels);
    } else if (message.action === 'stopUnsubscribe') {
      isUnsubscribing = false;
    }
  });
});
