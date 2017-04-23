/**
 * Created by sav on 2017/4/19.
 */
(function(){

    var $doms = {},
        _isHiding = false;

    var self = window.Publish.WorkPart =
    {
        init: function($container, $parent)
        {
            $doms.container = $container;
            $doms.parent = $parent;

            return self;
        },

        show: function(cb)
        {
            if(!_isHiding) return;
            _isHiding = false;

            ga('send', 'pageview', '發表宣言 - 上傳與填字');

            $doms.parent.toggleClass('success-mode', false);
            $doms.parent.toggleClass('coupon-mode', false);

            $("#scene-container").toggleClass("height-1150", true);

            TweenMax.to($doms.container,.4,{autoAlpha:1, marginLeft: 0, onComplete: cb});
        },

        hide: function(cb)
        {
            if(_isHiding) return;
            _isHiding = true;

            TweenMax.to($doms.container,.4,{autoAlpha:0, marginLeft: 50, onComplete: function()
            {
                $("#scene-container").toggleClass("height-1150", false);
                if(cb) cb.call();
            }});
        }
    };

}());