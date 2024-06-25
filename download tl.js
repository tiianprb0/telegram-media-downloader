// ==UserScript==
// @name         Telegram Media Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add a floating download button for photos and videos on Telegram Web
// @author       ChatGPT
// @match        https://web.telegram.org/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to create the download button
    function createDownloadButton() {
        const button = document.createElement('button');
        button.style.position = 'fixed';
        button.style.right = '20px';
        button.style.bottom = '50%';
        button.style.transform = 'translateY(50%)';
        button.style.zIndex = '1000';
        button.style.width = '50px';
        button.style.height = '50px';
        button.style.borderRadius = '50%';
        button.style.backgroundColor = '#0088cc';
        button.style.border = 'none';
        button.style.outline = 'none';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';

        // Create the icon for the button
        const icon = document.createElement('span');
        icon.innerHTML = '⬇';  // Download icon
        icon.style.fontSize = '24px';
        icon.style.color = 'white';
        button.appendChild(icon);

        document.body.appendChild(button);

        button.addEventListener('click', downloadMedia);

        return button;
    }

    // Function to download the media
    function downloadMedia() {
        const activeMedia = document.querySelector('div[role="dialog"] img, div[role="dialog"] video');
        if (activeMedia) {
            const mediaURL = activeMedia.src;
            const anchor = document.createElement('a');
            anchor.href = mediaURL;
            anchor.download = 'media';
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
        } else {
            alert('No media found to download.');
        }
    }

    // Create and add the download button to the page
    const downloadButton = createDownloadButton();
})();
