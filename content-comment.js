var stopDeleting = false;

chrome.runtime.onMessage.addListener(async (message) => {
    if (message.action === 'startComment') {
        stopDeleting = false;
        await removeComments();
    } else if (message.action === 'stopComment') {
        stopDeleting = true;
    }
});

async function removeComments() {
    const DELAY = 5000;
    const PAUSE = 5000;
    const COMMENT_SELECTOR = ".YxbmAc";
    const SCROLL_THROTTLE_TIME = 200; // Throttle auto-scrolling
    const AUTO_SCROLL_THRESHOLD = 3; // Scroll when only 3 or fewer comments are left

    function autoScroll() {
        let lastScrollTime = 0;

        function scroll() {
            const currentTime = Date.now();
            if (currentTime - lastScrollTime >= SCROLL_THROTTLE_TIME) {
                window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
                lastScrollTime = currentTime;
            }
            if (!stopDeleting) {
                window.requestAnimationFrame(scroll);
            }
        }

        if (!stopDeleting) {
            scroll();
        }
    }

    async function deleteComment(element) {
        if (stopDeleting) {
            console.log("Stopping comment removal.");
            return;
        }

        try {
            const deleteButton = element.querySelector(".VfPpkd-rymPhb-pZXsl") || element.querySelector(".VfPpkd-Bz112c-LgbsSe");
            deleteButton.click();
            await new Promise(resolve => setTimeout(resolve, DELAY));
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    }

    async function removeCommentsSequentially() {
        for (let i = 0; i < myList.length; i++) {
            await deleteComment(myList[i]);

            if (i < myList.length - 1 && (myList.length - i - 1) <= AUTO_SCROLL_THRESHOLD) {
                autoScroll();
                await new Promise(resolve => setTimeout(resolve, PAUSE));
            }
        }
    }

    const myList = document.querySelectorAll(COMMENT_SELECTOR);

    if (myList.length === 0) {
        console.log("There are no comments, exiting.");
        return;
    }

    await removeCommentsSequentially();
}
