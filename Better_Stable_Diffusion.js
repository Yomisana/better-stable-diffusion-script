// ==UserScript==
// @name         Better_Stable_Diffusion
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world! Just Kidding ;)
// @author       Yomisana and Mjolnir Studio Team
// @match        https://civitai.com/models/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.6.3.min.js#sha256-pvPw+upLPUjgMXY0G+8O0xUf+/Im1MZjXxxgOcBQBXU=
// @icon         https://www.google.com/s2/favicons?sz=64&domain=civitai.com
// @connect      localhost
// @run-at       document-end
// ==/UserScript==

(function($) {
    'use strict';

    var timer = setInterval(()=>{
        if($('.CUSTOM_BTN').length > 0){
            clearInterval(timer);

            $('body').on('click', '.CUSTOM_BTN',function(){
                let url = location.origin + $(this).prev().find('a[href]').attr('href');
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "http://localhost:7868/?url="+url,
                    onload: function(response) {
                        console.log(response);
                    },
                    onerror: function(err){
                        console.log(err);
                    }
                });
            });
        }
        else{
            $('a[href^="/api/download/models/"]').parent().after('<button class="mantine-luyglw CUSTOM_BTN" style="text-align: center;" type="button" data-button="true">BSD</button>');
        }
    },250);
    // Your code here...
})(jQuery);
