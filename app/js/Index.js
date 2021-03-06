(function ()
{
    var $doms = {},
        _isInit = false,
        _isVideoSet = false,
        _isBackgroundsSet = false,
        _viewportIndex = null,
        _contentTL;

    var self = window.Index =
    {
        stageIn: function (options, cb)
        {

            (!_isInit) ? loadAndBuild(execute) : execute();
            function execute(isFromLoad)
            {
                if (isFromLoad && options.cbContentLoaded) options.cbContentLoaded.call();
                show(cb);
            }

            function loadAndBuild(cb)
            {
                var templates =
                    [
                        {url: "_index.html", startWeight: 0, weight: 100, dom: null}
                    ];

                SceneHandler.loadTemplate(null, templates, function loadComplete()
                {
                    build(templates);
                    _isInit = true;
                    cb.apply(null);
                }, 0);
            }
        },

        stageOut: function (options, cb)
        {
            hide(cb);
        },

        resize: function (isFromShow)
        {
            if(_isInit)
            {
                if(BGManager.resize(showContent))
                {
                    TweenMax.set($doms.content, {autoAlpha:0});
                }
                else if(isFromShow)
                {
                    showContent();
                }
            }
        }
    };

    function showContent()
    {

        if(Main.viewport.index === 0)
        {
            playContents_mobile();
        }
        else
        {
            playContents_pc();
        }
    }


    function build(templates)
    {
        $("#invisible-container").append(templates[0].dom);
        $doms.container = $("#index");

        $doms.content = $doms.container.find(".content");

        $.extend($doms,
        {
            content: $doms.container.find(".content"),
            leftText1: $doms.container.find(".left-text-1"),
            rightText1: $doms.container.find(".right-text-1"),
            rightText2: $doms.container.find(".right-text-2"),
            rightText3: $doms.container.find(".right-text-3"),
            btnStart: $doms.container.find(".btn-start"),
            videoSelect: $doms.container.find(".video-select")
        });

        $doms.leftText1.letters = $doms.leftText1.find("div");

        $doms.rightText1.letters = $doms.rightText1.find("div");
        $doms.rightText2.letters = $doms.rightText2.find("div");
        $doms.rightText3.letters = $doms.rightText3.find("div");

        $doms.btnStart = $doms.container.find(".btn-start").on(_CLICK_, function()
        {
            ga('send', 'event', '首頁', '按鈕點擊', '留下宣言');
            Main.loginFB('/Publish');
        });

        setupVideoSelector();


        $doms.container.detach();
    }

    function setupVideoSelector()
    {
        var numVideos = 6,
            currentIndex = 1,
            i,
            isLocking = false;



        $doms.arrowLeft = $doms.videoSelect.find(".arrow-left").on(_CLICK_, function()
        {
            if(isLocking) return;
            toIndex(currentIndex-1);
        });

        $doms.arrowRight = $doms.videoSelect.find(".arrow-right").on(_CLICK_, function()
        {
            if(isLocking) return;
            toIndex(currentIndex+1);
        });

        var $thumbContainer = $doms.videoSelect.find('.thumb-container').on(_CLICK_, function()
        {
            var videoDic = Videos.getVideoDic(),
                obj = videoDic[currentIndex];

            ga('send', 'event', '首頁', '點擊影片縮圖', obj.title);

            if(obj.link)
            {
                window.open(obj.link, '_blank');
            }
            else if(obj.id)
            {
                Videos.setPlayingIndex(currentIndex);
                SceneHandler.toHash("/Videos");
            }
            else
            {
                alert('影片尚未開放，敬請期待');
            }
        });

        var $thumbWrapper = $thumbContainer.find(".wrapper"),
            $videoDesc = $doms.videoSelect.find(".video-desc");

        $doms.videoSelect.toIndex = toIndex;

        function toIndex(index)
        {
            if(index < 1) return;
            if(index > numVideos) return;

            currentIndex = index;

            var offsetUnit = Main.viewport.index == 0? 246: 136,
                offset = offsetUnit * -(currentIndex-1);

            isLocking = true;
            TweenMax.to($thumbWrapper,.4,{marginLeft:offset, onComplete: function()
            {
                isLocking = false;
            }});

            updateArrows();

            var videoDic = Videos.getVideoDic();
            $videoDesc.text(videoDic[currentIndex].title);
        }

        function updateArrows()
        {
            $doms.arrowLeft.toggleClass("hiding", currentIndex == 1);
            $doms.arrowRight.toggleClass("hiding", currentIndex == numVideos);
        }
    }

    function playContents_pc()
    {

        if(_contentTL) _contentTL.kill();

        $doms.videoSelect.toIndex(1);

        var tl = _contentTL = new TimelineMax;

        tl.set($doms.content, {autoAlpha:0});
        tl.to($doms.content,.5, {autoAlpha: 1, ease:Power1.easeIn});

        tl.set($doms.rightText1.letters, {autoAlpha:0, marginLeft: r1, marginTop: r2, rotationX: r3, rotationY: r3, scale: r4}, 0);
        tl.staggerTo($doms.rightText1.letters, 1, {autoAlpha:1, marginLeft: 0, marginTop: 0, rotationX: 0, rotationY: 0, scale:1},.1,.5);

        tl.set($doms.rightText2.letters, {autoAlpha:0, marginLeft: r1, marginTop: r2, rotationX: r3, rotationY: r3, scale: r4}, 0);
        tl.staggerTo($doms.rightText2.letters, 1, {autoAlpha:1, marginLeft: 0, marginTop: 0, rotationX: 0, rotationY: 0, scale:1},.1,.5);

        tl.set($doms.rightText3.letters, {autoAlpha:0, marginLeft: r1, marginTop: r2, rotationX: r3, rotationY: r3, scale: r4}, 0);
        tl.staggerTo($doms.rightText3.letters, 1, {autoAlpha:1, marginLeft: 0, marginTop: 0, rotationX: 0, rotationY: 0, scale:1},.03,.5);

        tl.set($doms.leftText1.letters, {scaleY: 0, transformOrigin: 'center bottom'}, 0);
        tl.staggerTo($doms.leftText1.letters,.5, {scaleY: 1, ease:Back.easeOut.config(4)},.01,"-=.01");

        tl.set($doms.btnStart, {autoAlpha:0}, 0);
        tl.to($doms.btnStart,1, {autoAlpha:1, ease:Power1.easeOut}, "-=.5");

        tl.set($doms.videoSelect, {autoAlpha:0}, 0);
        tl.to($doms.videoSelect,1, {autoAlpha:1, ease:Power1.easeOut}, "-=.5");
    }

    function playContents_mobile()
    {
        if(_contentTL) _contentTL.kill();

        $doms.videoSelect.toIndex(1);

        var tl = _contentTL = new TimelineMax;

        tl.set($doms.content, {autoAlpha:0});
        tl.to($doms.content, 1, {autoAlpha: 1, ease:Power1.easeIn}, 0);

        tl.set($doms.btnStart, {autoAlpha:1}, 0);
        tl.set($doms.videoSelect, {autoAlpha:1}, 0);
    }

    function r1()
    {
        return 100 + Math.random()*100;
    }

    function r2()
    {
        return -50 + Math.random()*100;
    }

    function r3()
    {
        return -360 + Math.random()*720;
    }

    function r4()
    {
        return -2 + Math.random()*4;
    }



    function show(cb)
    {
        $("#scene-container").append($doms.container);

        ga('send', 'pageview', '首頁');

        self.resize(true);

        var tl = new TimelineMax;
        tl.set($doms.container, {autoAlpha: 0});
        tl.to($doms.container, .4, {autoAlpha: 1});
        tl.add(function ()
        {
            cb.apply();
        });
    }

    function hide(cb)
    {
        var tl = new TimelineMax;
        tl.to($doms.container, .4, {autoAlpha: 0});
        tl.add(function ()
        {
            $doms.container.detach();
            cb.apply();
        });
    }

}());