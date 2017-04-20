/**
 * Created by sav on 2017/4/19.
 */
(function(){

    var $doms = {},
        _couponUrl,
        _isHiding = true;

    var self = window.Publish.Coupon =
    {
        init: function($container, $parent)
        {
            $doms.container = $container;
            $doms.parent = $parent;

            $doms.couponImage = $doms.container.find(".coupon-image");
            $doms.btnDownload = $doms.container.find(".btn-download").on(_CLICK_, function()
            {
                if(_couponUrl)
                {
                    window.open(_couponUrl + "?download=1", "_blank");
                }
            });

            return self;
        },

        setCouponUrl: function(url)
        {
            _couponUrl = url;

            if(_couponUrl)
            {
                $doms.couponImage.css("background-image", "url("+_couponUrl+")").css("background-size", 'cover');
            }
            else
            {
                $doms.couponImage.css("background-image", "none");
            }
        },

        getCouponUrl: function(url)
        {
            return _couponUrl;
        },

        show: function(cb)
        {
            if(!_isHiding) return;
            _isHiding = false;

            TweenMax.to($doms.container,.4,{autoAlpha:1, delay:.9, onComplete: cb});

            $doms.parent.toggleClass('success-mode', false);
            $doms.parent.toggleClass('coupon-mode', true);
        },

        hide: function(cb)
        {
            if(_isHiding) return;
            _isHiding = true;

            TweenMax.to($doms.container,.4,{autoAlpha:0, onComplete: cb});
        }
    };

}());