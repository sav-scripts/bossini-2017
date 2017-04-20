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

            $doms.btnIndex = $doms.buttonContainer.find(".btn:nth-child(1)").on(_CLICK_, function()
            {
                self.close();
                SceneHandler.toHash("/Index");
            });

            $doms.btnVideo = $doms.buttonContainer.find(".btn:nth-child(2)").on(_CLICK_, function()
            {
                self.close();
                SceneHandler.toHash("/Videos");
            });

            $doms.btnPublish = $doms.buttonContainer.find(".btn:nth-child(3)").on(_CLICK_, function()
            {
                self.close();
                Main.loginFB('/Publish');
            });

            $doms.btnHistory = $doms.buttonContainer.find(".btn:nth-child(4)").on(_CLICK_, function()
            {
                self.close();
                SceneHandler.toHash("/Entries");
            });

            $doms.btnRule = $doms.buttonContainer.find(".btn:nth-child(5)").on(_CLICK_, function()
            {
                self.close();
                SceneHandler.toHash("/Rule");
            });

            $doms.btnOfficial = $doms.buttonContainer.find(".btn:nth-child(6)").on(_CLICK_, function()
            {
                self.close();
            });

            $doms.btnVip = $doms.buttonContainer.find(".btn:nth-child(7)").on(_CLICK_, function()
            {
                self.close();
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
