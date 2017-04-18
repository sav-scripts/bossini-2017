/**
 * Created by sav on 2017/4/19.
 */
(function(){

    var $doms = {},
        _isHiding = true;

    var self = window.Publish.FormPart =
    {
        init: function($container)
        {
            $doms.container = $container;

            TweenMax.set($doms.container,{autoAlpha:0, marginLeft: -50});

            return self;
        },

        show: function(cb)
        {
            if(!_isHiding) return;
            _isHiding = false;

            TweenMax.set($doms.container,{autoAlpha:0, marginLeft: -50});
            TweenMax.to($doms.container,.4,{autoAlpha:1, marginLeft: 0, onComplete: cb});
        },

        hide: function(cb)
        {
            if(_isHiding) return;
            _isHiding = true;

            TweenMax.to($doms.container,.4,{autoAlpha:0, marginLeft: 50, onComplete: cb});
        }
    };

}());