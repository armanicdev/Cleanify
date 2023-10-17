let shouldStopDeleting = false;
let autoScrollTimeout;

chrome.runtime.onMessage.addListener(async (message) => {
    if (message.action === 'startComment') {
        shouldStopDeleting = false;
        await removeComments();
    } else if (message.action === 'stopComment') {
        shouldStopDeleting = true;
        clearTimeout(autoScrollTimeout);
    }
});

async function removeComments() {
    const commentRemovalDelay = 5000;
    const pauseBetweenRemovals = 5000;
    const commentSelector = ".YxbmAc";
    const scrollThrottleTime = 200;
    const autoScrollThreshold = 3;

    const promisifiedTimeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    function debounce(func, wait) {
        let timeout;
        return function () {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                timeout = null;
                func.apply(context, args);
            }, wait);
        };
    }

    const debouncedAutoScroll = debounce(autoScroll, scrollThrottleTime);

    function autoScroll() {
        let lastScrollTime = 0;
        const currentTime = Date.now();

        if (currentTime - lastScrollTime >= scrollThrottleTime) {
            window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
            lastScrollTime = currentTime;
        }

        if (!shouldStopDeleting) {
            autoScrollTimeout = setTimeout(debouncedAutoScroll, scrollThrottleTime);
        }
    }

    async function deleteComment(element) {
        if (shouldStopDeleting) {
            return;
        }

        try {
            const deleteButton = element.querySelector(".VfPpkd-rymPhb-pZXsl, .VfPpkd-Bz112c-LgbsSe");
            if (deleteButton) {
                deleteButton.click();
                await promisifiedTimeout(commentRemovalDelay);
            } else {
                console.warn("Delete button not found for the comment:", element);
            }
        } catch (error) {
            console.error("Error deleting comment:", error, element);
        }
    }

    async function removeCommentsSequentially() {
        const commentList = document.querySelectorAll(commentSelector);

        if (commentList.length === 0) {
            return;
        }

        for (let i = 0; i < commentList.length && !shouldStopDeleting; i++) {
            await deleteComment(commentList[i]);

            if (i < commentList.length - 1 && (commentList.length - i - 1) <= autoScrollThreshold) {
                debouncedAutoScroll();
                await promisifiedTimeout(pauseBetweenRemovals);
            }
        }
    }

    await removeCommentsSequentially();
}