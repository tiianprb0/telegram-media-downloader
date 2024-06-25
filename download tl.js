// ==UserScript==
// @name         Telegram Downloader
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Download media from Telegram Web
// @author       Tian
// @match        https://web.telegram.org/*
// @grant        none
// @icon         https://www.seekpng.com/png/detail/945-9450674_web-telegram-icon-telegram-png.png

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
        button.style.bottom = '130px';  // Adjusted to move the button higher
        button.style.width = '40px';
        button.style.height = '40px';
        button.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        button.style.border = '1px solid #ccc';
        button.style.borderRadius = '50%';
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.zIndex = 1000;

        const icon = document.createElement('img');
        icon.src = downloadIconUrl;
        icon.style.width = '24px';
        icon.style.height = '24px';
        button.appendChild(icon);

        document.body.appendChild(button);
    }

    // Function to find media URLs
    function findMediaURL(node) {
        let url = null;
        if (node.nodeName === 'VIDEO') {
            url = node.src || node.querySelector('source')?.src;
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
