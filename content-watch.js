let stopRemoving = false;

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'startNewAction') {
        console.log("Started removing");
        stopRemoving = false;
        removeWatchs();
    } else if (message.action === 'stopNewAction') {
        console.log("Stopped removing");
        stopRemoving = true;
    }
});

function removeWatchs() {
    const video = document.querySelector('ytd-playlist-video-renderer');

    if (video && !stopRemoving) {
        const actionButton = video.querySelector('#primary button[aria-label="Action menu"]');

        if (actionButton) {
            actionButton.click();

            setTimeout(() => {
                const removeButtons = Array.from(document.querySelectorAll('yt-formatted-string'))
                    .filter((button) => button.textContent.includes('Remove from'));

                removeButtons.forEach((button) => {
                    button.click();
                });

                // Call the function recursively to continue removing items
                removeWatchs();
            }, 500);
        }
    }
}
