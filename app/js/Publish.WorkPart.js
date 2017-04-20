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

            $doms.parent.toggleClass('success-mode', false);
            $doms.parent.toggleClass('coupon-mode', false);

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