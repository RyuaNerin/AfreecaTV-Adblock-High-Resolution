// ==UserScript==
// @name         아프리카TV - 그리드 우회 & 광고 제거
// @namespace    http://tampermonkey.net/
// @description  아프리카TV 그리드를 우회하여 1080p를 언락하고, 광고를 스킵해주는 메크로
// @author       Nikuname, Clrain
// @version      1.1.2
// @match        https://play.afreecatv.com/*
// @match        https://vod.afreecatv.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=afreecatv.com
// @updateURL    https://github.com/nikuname/AfreecaTV-Adblock-High-Resolution/raw/main/src/main.user.js
// @downloadURL  https://github.com/nikuname/AfreecaTV-Adblock-High-Resolution/raw/main/src/main.user.js
// @grant        none
// ==/UserScript==

(function() {
    let updateLoopTime = 50;
    let isFirstFrame = false;
    let isFirstStreamFrame = false;
    let isFirstAdFrame = false;
    
    function Unlock()
    {
        //LivePlayer.getPlayerInfo().isQualityConnectToAgent = () => false;
        //LivePlayer.getPlayer().streamConnector.streamer.streamer.stream.changeQuality("ORIGINAL");
        //ORIGINAL
        //LOW
        //NORMAL
        //HIGH
        //AUTO
        try
        {
            if(LivePlayer.getPlayer().streamConnector.isConnected == true)
            {
                if(isFirstStreamFrame)
                {
                    Object.defineProperty(LivePlayer.getInstance().streamConnector, 'isUsingAgent', {
                        get() {
                            return true;
                        },
                        configurable: true,
                        enumerable: true
                    });

                    //LivePlayer.getPlayer().streamConnector.streamer.streamer.stream.changeQuality("ORIGINAL");
                    //LivePlayer.getPlayer().streamConnector.streamer.streamer.stream.changeQuality("AUTO");
                    LivePlayer.getPlayerInfo().quality = "ORIGINAL";
                    LivePlayer.getPlayerInfo().isLowLatency = true;
                    LivePlayer.getPlayer().streamConnector.streamer.onLowLatency();
                    LivePlayer.getPlayer().streamConnector.streamer.streamer.stream.setLowLatency(2);

                    isFirstStreamFrame = false;
                    console.log("Complated");
                }
            }
            else
            {
                isFirstStreamFrame = true;
            }
        }
        catch(e)
        {
            
        }
    }

    function CloseHighPopup()
    {
        try
        {
            let bgDarkElements = document.querySelectorAll('.bg_dark');
            bgDarkElements.forEach(element => {
                element.remove();
            });

            let layerElement = document.querySelector('.layer_m#layer_high_quality');
            if (layerElement) {
                layerElement.remove();
            }
        }
        catch(e)
        {
            
        }
    }
    function LiveCloseAd()
    {
        try
        {
            if(LivePlayer.getPlayer().adConnector._streamer.streamer.stream != null)
            {
                LivePlayer.getPlayer().adConnector.closeAll();
                isFirstAdFrame = true;
            }
        }
        catch(e)
        {
            isFirstAdFrame = false;
        }
    }
    function VodCloseAd()
    {
        try
        {
            if(vodCore.identity == "AD")
            {
                vodCore.adController.AdController.handleEnded();
                vodCore.adController.closeMedia(vodCore.adController.media);
                vodCore.playerController.directPlay();
                //console.log("1234");
                //this.adController.closeMedia(this.adController.media)
                //this.vodCore.adController.rollType
                //this.vodCore.adController.AdController.adBufferTime
                //this.vodCore.adController.AdController.midRollPlayingTime = 360;
            }
        }
        catch(e)
        {
            
        }
    }
    function VodCloseNextVideo()
    {
        try
        {
            let next = document.querySelector(".nextvideo");
            if(next)
            {
                next.remove(); // 이거 코드로 먼저 테스트하기
            }
        }
        catch(e)
        {

        }
    }
    function InitLive()
    {
        try
        {
            if(isFirstFrame)
            {
                Object.defineProperty(LivePlayer.getInstance().streamConnector, 'isUsingAgent', {
                    get() {
                        return true;
                    },
                    configurable: true,
                    enumerable: true
                });

                LivePlayer.getPlayerInfo().nQuickViewMode = 9;

                if(LivePlayer.getPlayerInfo().isLogin)
                {
                    let name = LivePlayer.getPlayerInfo().szUserNick;
                }
                isFirstFrame = false;
            }
        }
        catch(e)
        {
            
        }
    }
    function cycleLive()
    {
        InitLive();
        LiveCloseAd();
        Unlock();
        CloseHighPopup();
        
        setTimeout(cycleLive, updateLoopTime);
    }
    
    function cycleVod()
    {
        VodCloseAd();
        setTimeout(cycleVod, updateLoopTime);
    }

    isFirstFrame = true;
    isFirstStreamFrame = true;

    if(window.location.hostname.includes("play"))
        cycleLive();
    if(window.location.hostname.includes("vod"))
        cycleVod();

})();