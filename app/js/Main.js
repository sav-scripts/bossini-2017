(function(){

    "use strict";
    var self = window.Main =
    {
        testmode: false,
        useFakeData: false,

        version: 6,

        localSettings:
        {
            fb_appid: "262099524195911"
        },

        settings:
        {
            isLocal: false,
            isMobile: false,

            useFakeData: false,

            fb_appid: "261350167604180",
            fbPermissions: [],

            fbToken: null,
            fbUid: null,

            fbState: null,

            isiOS: false,
            isLineBrowser: false
        },

        viewport:
        {
            width: 0,
            height: 0,
            ranges: [640],
            index: -1,
            changed: false
        },

        hashArray:
        [
            "/Index",
            "/Videos",
            "/Publish",
            "/Entries",
            "/Rule"
        ],

        defaultHash: "/Index",

        init: function()
        {
            FBHelper.checkAccessToken();

            if( window.location.host == "local.savorks.com" || window.location.host == "socket.savorks.com")
            {
                $.extend(self.settings, self.localSettings);
                Main.settings.isLocal = true;

                if(Utility.urlParams.fakedata == '1') Main.useFakeData = true;
                if(Utility.urlParams.testmode == '1') Main.testmode = true;
            }

            ScalableContent.init(self.viewport.ranges);
            ScalableContent.enableFixFullImage = false;
            ScalableContent.enableDrawBounds = true;

            self.settings.isLineBrowser = Boolean(navigator.userAgent.match('Line'));
            self.settings.isiOS = Utility.isiOS();
            window._CLICK_ = (self.settings.isiOS)? "touchend": "click";

            Menu.init();
            BGManager.init();

            FBHelper.init(Main.settings.fb_appid,
            {
                useRedirectLogin: (Main.settings.isiOS || Main.settings.isLineBrowser)
            });

            startApp();

            $(window).on("resize", onResize);
            onResize();


            function startApp()
            {
                SceneHandler.init(self.hashArray,
                {
                    defaultHash: self.defaultHash,
                    listeningHashChange: true,
                    loadingClass: Loading,
                    version: Utility.urlParams.nocache == '1'? new Date().getTime(): Main.version,

                    cbBeforeChange: function()
                    {
                    },

                    cbAfterChange: function()
                    {
                        Menu.show();
                    },

                    hashChangeTester: function(hashName)
                    {

                        if(hashName == "/Publish")
                        {
                            if(!FBHelper._token && !Main.testmode)
                            {
                                SceneHandler.toHash(self.defaultHash);
                                return null;
                            }

                        }

                        return hashName;
                    }
                });

                SceneHandler.toFirstHash();
            }
        },

        loginFB: function(nextHash, redirectUri)
        {
            Loading.progress("登入 facebook 中").show();

            FBHelper.loginFB(nextHash, redirectUri, function(error)
            {
                Loading.hide();

                if(error && error == 'unauthorized')
                {
                    alert('您必須登入 facebook 才能參加活動喔');
                }
                else if(error)
                {
                    alert(error);
                }
                else
                {
                    SceneHandler.toHash(nextHash);
                }
            });
        }
    };

    function onResize()
    {
        var width = $(window).width(),
            height = $(window).height();

        var obj = ScalableContent.updateView(width, height);
        var vp = self.viewport;
        vp.changed = obj.modeChanged;
        vp.index = obj.modeIndex;
        vp.width = width;
        vp.height = height;

        //BGManager.resize();

        if(SceneHandler.currentScene && SceneHandler.currentScene.resize) SceneHandler.currentScene.resize();
    }

}());
