// ==UserScript==
// @name         Telegram Media Downloader
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Download media from Telegram Web
// @author       Tian
// @match        https://web.telegram.org/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // URL to download icon
    const downloadIconUrl = 'https://static.vecteezy.com/system/resources/previews/015/337/688/non_2x/download-download-icon-free-png.png';

    // Function to create a floating download button
    function createDownloadButton(url, filename, mediaElement) {
        const button = document.createElement('a');
        button.href = url;
        button.download = filename;
        button.style.position = 'fixed';
        button.style.right = '10px';
        button.style.bottom = '100px';  // Adjusted to move the button higher
        button.style.width = '150px'; // Increased button width
        button.style.height = '40px'; // Button height
        button.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        button.style.border = '1px solid #ccc';
        button.style.borderRadius = '5px'; // Slight border radius
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.zIndex = 1000;

        const icon = document.createElement('img');
        icon.src = downloadIconUrl;
        icon.style.width = '24px';
        icon.style.height = '24px';
        icon.style.marginRight = '5px'; // Added margin to icon for spacing
        button.appendChild(icon);

        const buttonText = document.createElement('span');
        buttonText.innerText = 'Download';
        button.appendChild(buttonText);

        document.body.appendChild(button);
    }

    // Function to find media URLs
    function findMediaURL(node) {
        let url = null;
        if (node.nodeName === 'VIDEO') {
            // Check for video stream URL pattern
            const src = node.src || node.querySelector('source')?.src;
            if (src && src.includes('.telegram.org/k/stream')) {
                url = src;
            }
        } else if (node.nodeName === 'IMG') {
            url = node.src;
        } else if (node.nodeName === 'DIV' && node.style.backgroundImage) {
            // Extract URL from background-image CSS property
            const backgroundImage = node.style.backgroundImage;
            url = backgroundImage.slice(4, -1).replace(/"/g, ""); // Remove 'url(' and ')' and quotes
        }
        return url;
    }

    // Observe DOM for changes
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        const url = findMediaURL(node);
                        if (url) {
                            const filename = url.split('/').pop().split('?')[0];
                            createDownloadButton(url, filename, node);
                        }
                    }
                });
            }
        });
    });

    // Start observing the document
    observer.observe(document.body, { childList: true, subtree: true });
})();
