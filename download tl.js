// ==UserScript==
// @name         Telegram Media Downloader
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Download media from Telegram Web
// @author       Tian
// @match        https://web.telegram.org/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // URL to download icon
    const downloadIconUrl = 'https://image.shutterstock.com/image-vector/download-icon-vector-260nw-1250254233.jpg';

    // Function to create a floating download button
    function createDownloadButton(url, filename, mediaElement) {
        const button = document.createElement('a');
        button.href = url;
        button.download = filename;
        button.style.position = 'fixed';
        button.style.right = '10px';
        button.style.bottom = '20px';
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

    // Observe DOM for changes
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && (node.matches('video') || node.matches('img'))) {
                        const url = node.src;
                        const filename = url.split('/').pop().split('?')[0];
                        createDownloadButton(url, filename, node);
                    }
                });
            }
        });
    });

    // Start observing the document
    observer.observe(document.body, { childList: true, subtree: true });
})();
