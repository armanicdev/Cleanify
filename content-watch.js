let stopRemoving = false;

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'startNewAction') {
        console.log("Started removing");
        stopRemoving = false;
        removeWatches();
    } else if (message.action === 'stopNewAction') {
        console.log("Stopped removing");
        stopRemoving = true;
    }
});

async function removeWatches() {
    while (!stopRemoving) {
        const video = document.querySelector('ytd-playlist-video-renderer');

        if (!video) {
            console.log("No more videos to remove");
            break;
        }

        const actionButton = video.querySelector('#primary button[aria-label="Action menu"]');

        if (actionButton) {
            actionButton.click();
            await sleep(500); // Wait for the action menu to open

            const removeButtons = Array.from(document.querySelectorAll('yt-formatted-string'))
                .filter((button) => button.textContent.includes('Remove from'));

            for (const button of removeButtons) {
                button.click();
                await sleep(500); // Wait before processing the next removal
            }
        }
    }

    console.log("Removal process completed");
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
