document.addEventListener('DOMContentLoaded', () => {
    const colorPicker = document.getElementById('highlight-color');
    const borderSizeSlider = document.getElementById('border-size');
    const borderSizeValue = document.getElementById('border-size-value');
  
    // Listen for color change
    colorPicker.addEventListener('change', () => {
        const selectedColor = colorPicker.value;
        const borderSize = borderSizeSlider.value;
  
        // Send the selected color and border size to the content script
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
                highlightColor: selectedColor,
                borderSize: borderSize
            });
        });
    });
  
    // Listen for border size change on the slider
    borderSizeSlider.addEventListener('input', () => {
        const selectedColor = colorPicker.value;
        const borderSize = borderSizeSlider.value;
        borderSizeValue.textContent = `${borderSize}px`;
  
        // Send the selected color and border size to the content script
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
                borderSize: borderSize
            });
        });
    });
  });