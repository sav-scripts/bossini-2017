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
                ga('send', 'event', '發表宣言 - 折價券', '點擊下載', _couponUrl);
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

        getCouponUrl: function()
        {
            return _couponUrl || false;
        },

        show: function(cb)
        {
            if(!_isHiding) return;
            _isHiding = false;

            ga('send', 'pageview', '發表宣言 - 折價券');

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