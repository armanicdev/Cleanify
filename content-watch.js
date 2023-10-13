let stopRemoving = false;

chrome.runtime.onMessage.addListener(async (message) => {
    if (message.action === 'startNewAction') {
        stopRemoving = false;
        await removeWatches();
    } else if (message.action === 'stopNewAction') {
        stopRemoving = true;
    }
});

async function removeWatches() {
    try {
        while (!stopRemoving) {
            const video = document.querySelector('ytd-playlist-video-renderer');

            if (!video) {
                break;
            }

            const actionButton = video.querySelector('#primary button[aria-label="Action menu"]');

            if (actionButton) {
                actionButton.click();
                await sleep(250);

                const removeButtons = Array.from(document.querySelectorAll('yt-formatted-string'))
                    .filter((button) => button.textContent.includes('Remove from'));

                for (const button of removeButtons) {
                    button.click();
                    await sleep(250);
                }
            }
        }
    } catch (error) {
    }
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
