/**
 * Created by sav on 2017/4/19.
 */
(function(){

    var $doms = {},
        _shareImageUrl,
        _gaGroup,
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
                ga('send', 'event', _gaGroup, '按鈕點擊', '跳過');
                self.toNextStep();
            });

            $doms.btnShare = $doms.container.find(".btn-share").on(_CLICK_, function()
            {
                ga('send', 'event', _gaGroup, '按鈕點擊', '分享 Facebook');

                FB.ui
                (
                    {
                        method:"feed",
                        display: "iframe",
                        link: Utility.getPath(),
                        picture: _shareImageUrl,
                        title: "bossini［ 不停止，就是最好的超越。］",
                        description: '不要停止，勇於向前，平凡中就能激起不平凡，今天的你 比昨天多了一點，現在比上一秒你多超越了一些， 不停止， 就是 最好的超越……寫下你的不停止宣言，就有機會獲得bossini好禮。'
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



            if(Publish.Coupon.getCouponUrl() == false)
            {
                $doms.contentText.toggleClass("no-coupon-mode", true);
                _gaGroup = '發表宣言 - 表單送交成功 - 折價券 - 無';
            }
            else
            {
                $doms.contentText.toggleClass("no-coupon-mode", false);
                _gaGroup = '發表宣言 - 表單送交成功 - 折價券 - 有';
            }

            ga('send', 'pageview', _gaGroup);

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