// ==UserScript==
// @name         Better_Stable_Diffusion
// @namespace    civitai-bsd-script
// @version      0.17
// @description  try to take over the world! Just Kidding ;)
// @author       Yomisana and Mjolnir Studio Team
// @match        https://civitai.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.3.min.js#sha256-pvPw+upLPUjgMXY0G+8O0xUf+/Im1MZjXxxgOcBQBXU=
// @icon         https://www.google.com/s2/favicons?sz=64&domain=civitai.com
// @connect      localhost
// @run-at       document-end
// ==/UserScript==
// 腳本測試的網址: https://civitai.com/models/8281
(function($) {
    'use strict';

    var timer = setInterval(() => {
        if ($('.CUSTOM_BTN[data-register="false"]').length > 0) {
            $('.CUSTOM_BTN[data-register="false"]').each(function(){
                $(this).on('click', function() {
                    var $btn = $(this);
                    let url = location.origin + $(this).prev().find('a[href]').attr('href');

                    // v2 版本，按下按鈕後可以選擇當前頁面上面預覽圖做為模型在SD上面的預覽圖
                    $btn.text('...');
                    let imageSrcList = [];
                    $('.mantine-7aj0so').each(function() {
                        let src = $(this).attr('src');
                        let regex = /^(https?:\/\/[^/]+\/[^/]+\/[^/]+\/)/; // 正規化
                        let match = src.match(regex);
                        if (match) {
                            let baseUrl = match[1];
                            let modifiedUrl = baseUrl + 'width=400,height=600/preview.png';
                            if (!imageSrcList.includes(modifiedUrl)) {
                                imageSrcList.push(modifiedUrl);
                            }
                        }
                    });
                    console.log(`[BSD] Model preview images: ${imageSrcList.length}`);
                    createImageSelectionWindow($btn, url, imageSrcList); // 顯示選擇預覽圖視窗 在 傳送的按鈕內進行傳輸
                });

                $(this).attr('data-register', true);
            });
        } else if($('a[href^="/api/download/models/"]').length > 0 && $('.CUSTOM_BTN').length === 0){
            $('a[href^="/api/download/models/"]').parent().after('<button class="mantine-luyglw CUSTOM_BTN" style="text-align: center;" type="button" data-register="false" data-button="true">BSD</button>');
        }
    }, 250);

    // 圖片選擇視窗
    function createImageSelectionWindow($btn, url, imageSrcList) {
        let container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        `;

        let childWindow = document.createElement('div');
        childWindow.style.cssText = `
            background-color: #fff;
            padding: 20px;
            max-width: 90%;
            max-height: 75%;
            overflow: auto;
            box-sizing: border-box;
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            align-items: flex-start;
            position: relative;
            z-index: 9999;
        `;

        // 標題
        let title = document.createElement('h1');
        title.textContent = 'Select Image of preview';
        childWindow.appendChild(title);
        title.style.cssText = `
            width: 100%;
            margin: 0;
        `;
        const maxImageWidth = 200;
        const maxImageHeight = 400;
        imageSrcList.forEach(function(src) {
            let image = document.createElement('img');
            image.src = src;
            image.style.cssText = `
                cursor: pointer;
                margin: 3px;
                max-width: ${maxImageWidth}px;
                max-height: ${maxImageHeight}px;
            `;

            image.addEventListener('click', function() {
                let selectedImages = childWindow.querySelectorAll('img.selected');
                selectedImages.forEach(function(selectedImage) {
                    selectedImage.classList.remove('selected');
                });

                image.classList.add('selected');
            });

            childWindow.appendChild(image);
        });

        let saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.style.cssText = `
            position: absolute;
            width: 64px;
            height: 32px;
            top: 2em;
            right: 0;
            margin-top: 0;
            margin-right: 20px;
        `;
        saveButton.addEventListener('click', function() {
            let selectedImages = childWindow.querySelectorAll('img.selected');
            let preview_url = selectedImages.length > 0 ? selectedImages[0].src : '';
            //console.log(purl);
            GM_xmlhttpRequest({
                method: "GET",
                url: `http://localhost:7858/?url=${url}&preview_url=${preview_url}`,
                onload: function(response) {
                    console.log(response);
                    showNotification(`[BSD] 傳送成功!成功將資料傳送至BSD軟體。`, 'success', 1500);
                    $btn.text('BSD');
                },
                onerror: function(err) {
                    console.log(err);
                    showNotification(`[BSD] 傳送失敗!無法將資料傳送至BSD軟體。`, 'error', 1500);
                    $btn.text('BSD');
                }
            });
            container.remove();
        });

        childWindow.appendChild(saveButton);
        container.appendChild(childWindow);

        document.body.appendChild(container);

        GM_addStyle(`
            .selected {
                border: 2px solid blue;
            }
        `);

        function updateImageSizes() {
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            const maxColumns = Math.floor(windowWidth / (maxImageWidth + 20));
            const maxRows = Math.floor(windowHeight / (maxImageHeight + 20));

            const childWindowWidth = maxColumns * (maxImageWidth + 20);
            const childWindowHeight = maxRows * (maxImageHeight + 20);

            childWindow.style.width = childWindowWidth + 'px';
            childWindow.style.height = childWindowHeight + 'px';
        }

        window.addEventListener('resize', updateImageSizes);
        updateImageSizes();
    }

    // 通知插件與軟體狀態視窗
    function showNotification(message, type, duration) {
        const notificationContainer = $('<div>', { class: `notification ${type}` });
        const notificationText = $('<span>', { class: 'notification-text' }).text(message);
        const progressBar = $('<div>', { class: 'progress-bar' });

        notificationContainer.append(notificationText);
        notificationContainer.append(progressBar);

        $('.mantine-u0eh0m .mantine-1kax3mv .mantine-fui8ih .mantine-mwqi5l .mantine-1g4q40w').after(notificationContainer);

        let progressWidth = 100;
        let progressInterval = setInterval(function() {
            progressWidth -= 100 / (duration / 1000);
            progressBar.css('width', progressWidth + '%');
        }, 50); // 調整為 50 毫秒的間隔時間

        setTimeout(function() {
            clearInterval(progressInterval);
            notificationContainer.remove();
        }, duration);

        progressBar.css('transition', 'width ' + (duration / 1000) + 's linear'); // 添加過渡效果
    }

    // Add CSS styles
    GM_addStyle(`
        .notification {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 10px;
            border-radius: 5px;
            font-size: 16px;
            font-weight: bold;
            z-index: 9999;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
        }

        .notification.success {
            background-color: #41b883;
            color: #fff;
        }

        .notification.error {
            background-color: #e74c3c;
            color: #fff;
        }

        .notification-text {
            padding: 5px 10px;
        }

        .progress-bar {
            width: 100%;
            height: 5px;
            background-color: #ddd;
            margin-top: 5px;
        }
    `);

    // Your code here...
})(jQuery);
