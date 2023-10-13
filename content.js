const UNSUBSCRIBE_DELAY_TIME = 500;
let isUnsubscribing = false;

async function unsubscribeFromChannels(channels, currentIndex = 0) {
  if (!isUnsubscribing) {
    console.log("Unsubscribe process stopped.");
    return;
  }

  if (currentIndex < channels.length) {
    const channel = channels[currentIndex];
    const unsubscribeButton = channel.querySelector('[aria-label^="Unsubscribe from"]');

    if (unsubscribeButton) {
      unsubscribeButton.click();
      await new Promise((resolve) => setTimeout(resolve, UNSUBSCRIBE_DELAY_TIME));

      const confirmButton = document.querySelector('yt-confirm-dialog-renderer [aria-label^="Unsubscribe"]');
      if (confirmButton) {
        confirmButton.click();
        console.log(`Unsubscribed ${currentIndex + 1}/${channels.length}`);
      }

      // Process the next channel after a delay
      setTimeout(() => unsubscribeFromChannels(channels, currentIndex + 1), UNSUBSCRIBE_DELAY_TIME);
    } else {
      // If the unsubscribe button is not found, move to the next channel
      unsubscribeFromChannels(channels, currentIndex + 1);
    }
  } else {
    console.log('Finished unsubscribing from channels.');
  }
}

window.addEventListener('load', () => {
  // Check if the current tab is the specified YouTube tab
  const isYouTubeTab = window.location.href.startsWith('https://www.youtube.com/feed/channels');

  if (isYouTubeTab) {
    const channels = Array.from(document.querySelectorAll('ytd-channel-renderer'));
    console.log(`${channels.length} channels found.`);

    chrome.runtime.onMessage.addListener((message) => {
      if (message.action === 'startUnsubscribe' && !isUnsubscribing && channels.length > 0) {
        isUnsubscribing = true;
        unsubscribeFromChannels(channels);
      } else if (message.action === 'stopUnsubscribe') {
        isUnsubscribing = false;
      }
    });
  } else {
    console.log("This script is not running on the specified YouTube tab.");
  }
});
