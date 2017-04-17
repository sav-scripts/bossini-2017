(function(){

    "use strict";
    var self = window.Main =
    {
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
            "/Publish"
        ],

        defaultHash: "/Index",

        init: function()
        {
            ScalableContent.init(self.viewport.ranges);
            ScalableContent.enableFixFullImage = false;
            ScalableContent.enableDrawBounds = true;


            self.settings.isiOS = Utility.isiOS();
            window._CLICK_ = (self.settings.isiOS)? "touchend": "click";

            Menu.init();
            BGManager.init();

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
                    version: Utility.urlParams.nocache == '1'? new Date().getTime(): "1",

                    cbBeforeChange: function()
                    {
                    },

                    cbAfterChange: function()
                    {
                        Menu.show();
                    },

                    hashChangeTester: function(hashName)
                    {
                        return hashName;
                    }
                });

                SceneHandler.toFirstHash();
            }
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
