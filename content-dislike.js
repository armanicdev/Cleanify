let stopDislikeFlag = false;
let dislikeIndex = 0;
let items;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'startDislike') {
        startDislike();
    } else if (message.action === 'stopDislike') {
        stopDislike();
    }
});

function initializeDislike() {
    stopDislikeFlag = false;
    items = document.querySelectorAll(
        `#primary ytd-playlist-video-renderer yt-icon-button.dropdown-trigger > button[aria-label]`
    );
}

async function startDislike() {
    initializeDislike();
    while (!stopDislikeFlag && dislikeIndex < items.length) {
        await dislikeVideo();
        dislikeIndex++;
    }
}

function stopDislike() {
    stopDislikeFlag = true;
}

async function dislikeVideo() {
    if (stopDislikeFlag || dislikeIndex >= items.length) {
        return;
    }

    const item = items[dislikeIndex];
    item.click();

    await sleep(500);

    const dropdown = document.querySelector(
        `tp-yt-paper-listbox.style-scope.ytd-menu-popup-renderer`
    );

    if (dropdown && dropdown.lastElementChild) {
        dropdown.lastElementChild.click();
    }
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}