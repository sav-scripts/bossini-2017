/**
 * Created by sav on 2017/4/19.
 */
(function(){

    var $doms = {},
        _shareImageUrl,
        _isHiding = true;

    var self = window.Publish.Success =
    {
        init: function($container, $parent)
        {
            $doms.container = $container;
            $doms.parent = $parent;

            $doms.contentText = $doms.container.find(".text");

            $doms.btnSkip = $doms.container.find(".btn-skip").on(_CLICK_, function()
            {
                self.toNextStep();
            });

            $doms.btnShare = $doms.container.find(".btn-share").on(_CLICK_, function()
            {
                FB.ui
                (
                    {
                        method:"feed",
                        display: "iframe",
                        link: Utility.getPath(),
                        picture: _shareImageUrl,
                        title: "feed title",
                        description: 'feed description'
                    },function(response)
                    {
                        //console.log(JSON.stringify(response));
                        if(response && response.error_message)
                        {
                            console.log(response.error_message);
                        }
                        else if(response && response.post_id)
                        {
                            self.toNextStep();
                        }
                    }
                );
            });

            return self;
        },

        toNextStep: function()
        {
            if(Publish.Coupon.getCouponUrl())
            {
                Publish.toStep('coupon');
            }
            else
            {
                //alert("no coupon");
                SceneHandler.toHash("/Entries");
            }
        },

        setShareImageUrl: function(url)
        {
            _shareImageUrl = url;
        },

        show: function(cb)
        {
            if(!_isHiding) return;
            _isHiding = false;

            TweenMax.to($doms.container,.4,{autoAlpha:1, delay:.9, onComplete: cb});

            $doms.contentText.toggleClass("no-coupon-mode", Publish.Coupon.getCouponUrl() == false);

            $doms.parent.toggleClass('coupon-mode', false);
            $doms.parent.toggleClass('success-mode', true);
        },

        hide: function(cb)
        {
            if(_isHiding) return;
            _isHiding = true;

            TweenMax.to($doms.container,.4,{autoAlpha:0, onComplete: cb});
        }
    };

}());