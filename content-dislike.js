let stopDislikeFlag = false; // Flag to indicate whether to stop disliking

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
    'use strict';

    console.log('Deleting liked videos');

    // Helper function for sleep
    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    const items = document.querySelectorAll(
        `#primary ytd-playlist-video-renderer yt-icon-button.dropdown-trigger > button[aria-label]`
    );

    for (let i = 0; i < items.length && !stopDislikeFlag; i++) {
        console.log(`Clicking item ${i + 1}`);
        items[i].click();

        // Replace the following timeout with an await sleep
        await sleep(500);

        if (
            document.querySelector(
                `tp-yt-paper-listbox.style-scope.ytd-menu-popup-renderer`
            ).lastElementChild
        ) {
            console.log('Disliking video');
            document
                .querySelector(
                    `tp-yt-paper-listbox.style-scope.ytd-menu-popup-renderer`
                )
                .lastElementChild.click();
        } else {
            console.log('Unable to find dislike option');
        }
    }

    console.log('Finished deleting liked videos');
}
