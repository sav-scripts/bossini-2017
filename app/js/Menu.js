(function(){

    var _isInit = false,
        _isHiding = true,
        _isOpening = false,
        $doms = {};

    var self = window.Menu =
    {
        init: function()
        {
            $doms.container = $("#menu");
            $doms.statement = $("#statement");

            $doms.buttonContainer = $doms.container.find(".button-container");

            $doms.openPart = $doms.container.find(".open-part").on(_CLICK_, function(event)
            {
                if(event.target.className !== 'btn')
                {
                    self.close();
                }
            });

            $doms.menuIcon = $doms.container.find(".icon").on(_CLICK_, function()
            {
                _isOpening? self.close(): self.open();
            });

            $doms.logo = $doms.container.find('.logo').on(_CLICK_, function()
            {
                ga('send', 'event', '選單', '按鈕點擊', 'logo');
                SceneHandler.toHash("/Index");
            });

            $doms.btnIndex = $doms.buttonContainer.find(".btn:nth-child(1)").on(_CLICK_, function()
            {
                self.close();
                ga('send', 'event', '選單', '按鈕點擊', '首頁');
                SceneHandler.toHash("/Index");
            });

            $doms.btnVideo = $doms.buttonContainer.find(".btn:nth-child(2)").on(_CLICK_, function()
            {
                self.close();
                ga('send', 'event', '選單', '按鈕點擊', '影片');
                SceneHandler.toHash("/Videos");
            });

            $doms.btnPublish = $doms.buttonContainer.find(".btn:nth-child(3)").on(_CLICK_, function()
            {
                self.close();
                ga('send', 'event', '選單', '按鈕點擊', '發表宣言');
                Main.loginFB('/Publish');
            });

            $doms.btnHistory = $doms.buttonContainer.find(".btn:nth-child(4)").on(_CLICK_, function()
            {
                self.close();
                ga('send', 'event', '選單', '按鈕點擊', '宣言牆');
                SceneHandler.toHash("/Entries");
            });

            $doms.btnRule = $doms.buttonContainer.find(".btn:nth-child(5)").on(_CLICK_, function()
            {
                self.close();
                ga('send', 'event', '選單', '按鈕點擊', '活動辦法與獎項');
                SceneHandler.toHash("/Rule");
            });

            $doms.btnOfficial = $doms.buttonContainer.find(".btn:nth-child(6)").on(_CLICK_, function()
            {
                self.close();
                ga('send', 'event', '選單', '按鈕點擊', 'bossini 官網');
                window.open('https://www.bossini.com.tw/', '_blank');
            });

            $doms.btnVip = $doms.buttonContainer.find(".btn:nth-child(7)").on(_CLICK_, function()
            {
                self.close();
                ga('send', 'event', '選單', '按鈕點擊', 'VIP 方案');
                SceneHandler.toHash("/Vip");
            });
        },

        show: function()
        {
            if(!_isHiding) return;
            _isHiding = false;

            $doms.container.toggleClass("hide-mode", false);
            $doms.statement.toggleClass("hide-mode", false);

        },

        hide: function()
        {
            if(_isHiding) return;
            _isHiding = true;

            $doms.container.toggleClass("hide-mode", true);
            $doms.statement.toggleClass("hide-mode", true);
        },

        open: function()
        {
            if(_isOpening) return;
            _isOpening = true;

            $doms.openPart.toggleClass('open-mode', _isOpening);
        },

        close: function()
        {
            if(!_isOpening) return;
            _isOpening = false;

            $doms.openPart.toggleClass('open-mode', _isOpening);
        },

        resize: function()
        {
            if(_isInit)
            {

            }
        }
    };

}());
