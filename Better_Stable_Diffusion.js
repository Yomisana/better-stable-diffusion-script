// ==UserScript==
// @name         Better_Stable_Diffusion
// @namespace    civitai-bsd-script
// @version      0.6
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
        if ($('.CUSTOM_BTN').length > 0) {
            $('.CUSTOM_BTN[data-register="false"]').each(function() {
                $('body').on('click', '.CUSTOM_BTN', function() {
                    let url = location.origin + $(this).prev().find('a[href]').attr('href');
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: "http://localhost:7858/?url=" + url,
                        onload: function(response) {
                            console.log(response);
                            showNotification(`[BSD]: 傳送成功!成功將資料傳送至BSD軟體。`, 'success', 5000);
                        },
                        onerror: function(err) {
                            console.log(err);
                            showNotification(`[BSD]: 傳送失敗!無法將資料傳送至BSD軟體。`, 'error', 5000);
                        }
                    });
                });

                $(this).attr('data-register', true);
            });
        } else if ($('a[href^="/api/download/models/"]').length > 0) {
            $('a[href^="/api/download/models/"]').parent().after('<button class="mantine-luyglw CUSTOM_BTN" style="text-align: center;" type="button" data-register="false" data-button="true">BSD</button>');
        }
    }, 250);

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