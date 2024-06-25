// ==UserScript==
// @name         Telegram Media Downloader
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Download media from Telegram Web
// @author       Tian
// @match        https://web.telegram.org/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to create a floating download button
    function createDownloadButton(url, filename) {
        const button = document.createElement('a');
        button.href = url;
        button.download = filename;
        button.style.position = 'fixed';
        button.style.right = '10px';
        button.style.bottom = '100px';  // Adjusted to move the button higher
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
        icon.src = 'https://static.vecteezy.com/system/resources/previews/015/337/688/non_2x/download-download-icon-free-png.png';
        icon.style.width = '24px';
        icon.style.height = '24px';
        button.appendChild(icon);

        document.body.appendChild(button);
    }

    // Observe DOM for changes
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeName === 'VIDEO' && node.src) {
                        const url = node.src;
                        let filename = url.split('/').pop().split('?')[0];

                        // Check if URL has metadata JSON
                        try {
                            const metadata = JSON.parse(decodeURIComponent(url.split("/")[url.split("/").length - 1]));
                            if (metadata.fileName) {
                                filename = metadata.fileName;
                            }
                        } catch (e) {
                            // Invalid JSON string or no metadata, continue with default filename
                        }

                        createDownloadButton(url, filename);
                    }
                });
            }
        });
    });

    // Start observing the document
    observer.observe(document.body, { childList: true, subtree: true });
})();
