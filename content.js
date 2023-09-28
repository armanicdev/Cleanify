// Credit: ArmanicYT

// Define the delay time for unsubscribing (in milliseconds)
const UNSUBSCRIBE_DELAY_TIME = 500;

// Flag to track whether unsubscribing is in progress
let isUnsubscribing = false;

// Function to unsubscribe from a list of channels
async function unsubscribeFromChannels(channels) {
  for (let i = 0; i < channels.length; i++) {
    // Check if unsubscribing has been stopped
    if (!isUnsubscribing) {
      console.log("Unsubscribe process stopped.");
      break;
    }

    // Get the current channel element
    const channel = channels[i];

    // Find the "Unsubscribe" button for the channel
    const unsubscribeButton = channel.querySelector('[aria-label^="Unsubscribe from"]');

    if (unsubscribeButton) {
      // Click the "Unsubscribe" button
      unsubscribeButton.click();

      // Wait for a short delay
      await new Promise((resolve) => setTimeout(resolve, UNSUBSCRIBE_DELAY_TIME));

      // Find the confirmation button for unsubscribing
      const confirmButton = document.querySelector('yt-confirm-dialog-renderer [aria-label^="Unsubscribe"]');

      if (confirmButton) {
        // Click the confirmation button
        confirmButton.click();
        console.log(`Unsubscribed ${i + 1}/${channels.length}`);
      }
    }
  }
}

// Add a listener for the page load event
window.addEventListener('load', async () => {
  // Find all channel elements on the page
  const channels = Array.from(document.querySelectorAll('ytd-channel-renderer'));
  console.log(`${channels.length} channels found.`);

  // Listen for messages from the extension
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Start the unsubscribe process if requested and not already in progress
    if (message.action === 'startUnsubscribe' && !isUnsubscribing) {
      isUnsubscribing = true;
      unsubscribeFromChannels(channels);
    } else if (message.action === 'stopUnsubscribe') {
      // Stop the unsubscribe process
      isUnsubscribing = false;
    }
  });
});