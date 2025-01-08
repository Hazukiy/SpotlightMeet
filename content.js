let highlightColor = "red"; // Default color
let participantParentId = ".dkjMxf"; // Encrypted class for parent container
let participantChildId = ".oZRSLe"; // Encrypted class for child element containing participant data
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
        const parentElement = element.closest(participantParentId);
        if (parentElement) {
            parentElement.style.border = `${borderSize}px solid ${highlightColor}`;
        }
    });
});

window.addEventListener('load', () => {
    let resizeTimeout;

    const highlightParticipant = () => {
        const observer = new MutationObserver((mutationsList) => {
            // Find all participants via the unique data attribute
            const participantElements = Array.from(document.querySelectorAll('[data-participant-id]'))
                .filter(element => element.closest(participantParentId)); 

            // Handle participant removals
            mutationsList.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.removedNodes.forEach(removedNode => {
                        // Check if the removed node is a 'div'
                        if (removedNode.tagName === 'DIV') {

                            // Check if it contains a child 'div' with the 'data-participant-id' attribute and the class '.oZRSLe'
                            const childDiv = removedNode.querySelector('div[data-participant-id].oZRSLe');
                            if (childDiv) {
                                const participantId = childDiv.dataset.participantId;
                                // Check if the element is highlighted and needs to be removed
                                highlightedElements.forEach(element => {
                                    const highlightedParticipantId = element.dataset.participantId;
                                    if (highlightedParticipantId === participantId) {
                                        // Remove the highlight from the element if it is highlighted
                                        element.style.border = ""; // Directly modify the element's style
                                        highlightedElements.delete(element); // Remove from the set
                                    }
                                });
                            }
                        }
                    });
                }
            });

            participantElements.forEach(element => {
                // Add listener to element if not added
                if (!element.dataset.listenerAdded) {
                    element.addEventListener('click', () => {
                        const parentElement = element.closest('.dkjMxf');
                        if (parentElement) {
                            if (highlightedElements.has(element)) {
                                // Remove highlight if already highlighted
                                parentElement.style.border = "";
                                highlightedElements.delete(element);
                            } else {
                                // Add highlight with selected color and border size
                                parentElement.style.border = `${borderSize}px solid ${highlightColor}`;
                                highlightedElements.add(element);
                            }
                        }
                    });

                    element.dataset.listenerAdded = true; // Mark as listener added
                }

                // Reapply the border for highlighted elements
                if (highlightedElements.has(element)) {
                    const parentElement = element.closest(participantParentId);
                    if (parentElement) {
                        parentElement.style.border = `${borderSize}px solid ${highlightColor}`;
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Handle window resizing
        window.addEventListener('resize', () => {
            // Clear the previous timeout if it exists
            clearTimeout(resizeTimeout);

            // Use a debounce technique to trigger the update after resizing
            resizeTimeout = setTimeout(() => {
                highlightedElements.forEach(element => {
                    const parentElement = element.closest(participantParentId);
                    if (parentElement) {
                        parentElement.style.border = `${borderSize}px solid ${highlightColor}`;
                    }
                });
            }, 100);
        });
    };

    highlightParticipant();
});
