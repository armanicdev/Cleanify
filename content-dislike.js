let stopDislikeFlag = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'startDislike') {
        console.log("Started disliking");
        stopDislikeFlag = false;
        deleteLikedVideos(); // Call your disliking function
    } else if (message.action === 'stopDislike') {
        console.log("Stopped disliking");
        stopDislikeFlag = true;
        // Add any logic needed when stopping the disliking process
    }
});

async function deleteLikedVideos() {
    console.log('Deleting liked videos');

    // Helper function for sleep
    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function processItem(i) {
        console.log(`Clicking item ${i + 1}`);
        const items = document.querySelectorAll(
            `#primary ytd-playlist-video-renderer yt-icon-button.dropdown-trigger > button[aria-label]`
        );

        if (i < items.length && !stopDislikeFlag) {
            items[i].click();

            // Replace the following timeout with an await sleep
            await sleep(500);

            const menuPopup = document.querySelector(
                `tp-yt-paper-listbox.style-scope.ytd-menu-popup-renderer`
            );

            if (menuPopup && menuPopup.lastElementChild) {
                console.log('Disliking video');
                menuPopup.lastElementChild.click();
            } else {
                console.log('Unable to find dislike option');
            }

            // Process the next item after a delay
            setTimeout(() => processItem(i + 1), 500);
        } else {
            console.log('Finished deleting liked videos');
        }
    }

    // Start processing items from the beginning
    processItem(0);
}
