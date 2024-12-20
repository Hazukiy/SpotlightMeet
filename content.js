let highlightColor = "red"; // Default color
let borderSize = 3; // Default border size in pixels
const highlightedElements = new Set(); // Track highlighted elements

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.highlightColor) {
        highlightColor = message.highlightColor;
    }
    if (message.borderSize) {
        borderSize = message.borderSize;
    }

    // Update the border color and size for all highlighted elements
    highlightedElements.forEach(element => {
        element.style.border = `${borderSize}px solid ${highlightColor}`;
    });
});

window.addEventListener('load', () => {
    const highlightParticipant = () => {
        const observer = new MutationObserver(() => {
            // Find all participants, dkjMxf is the encoded panel
            const participants = document.querySelectorAll('.dkjMxf');

            participants.forEach(element => {
                if (!element.dataset.listenerAdded) {
                    element.addEventListener('click', () => {
                        if (highlightedElements.has(element)) {
                            // Remove highlight if already highlighted
                            element.style.border = "";
                            highlightedElements.delete(element);
                        } else {
                            // Add highlight with selected color and border size
                            element.style.border = `${borderSize}px solid ${highlightColor}`;
                            highlightedElements.add(element);
                        }
                    });

                    element.dataset.listenerAdded = true; // Mark as listener added
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };

    highlightParticipant();
});