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
                        {url: "_index.html?v=3", startWeight: 0, weight: 100, dom: null}
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

        resize: function ()
        {
            if(_isInit)
            {
                var oldViewportIndex = _viewportIndex,
                    vp = Main.viewport;

                _viewportIndex = vp.index;
                var isChanged = oldViewportIndex != _viewportIndex;

                if(isChanged)
                {
                    TweenMax.set($doms.content, {autoAlpha: 0});

                    if(vp.index == 0)
                    {
                        setupBackgrounds();
                        $doms.backgrounds.restart();

                        if(_isVideoSet)
                        {
                            $doms.video.stop();
                        }
                    }
                    else
                    {
                        setupVideo();
                        $doms.video.restart();

                        if(_isBackgroundsSet)
                        {
                            $doms.backgrounds.stop();
                        }
                    }
                }
            }
        }
    };


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


        $doms.container.detach();
    }

    function playContents_pc()
    {
        if(_contentTL) _contentTL.kill();

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

    function setupBackgrounds()
    {
        if(_isBackgroundsSet) return;
        _isBackgroundsSet = true;

        var _currentIndex = 1,
            _numBackgrounds = 5,
            _sceneDuration = 5,
            _fadeDuration = 1,
            $bgDic = {};

        $doms.backgrounds = $doms.container.find(".backgrounds");

        var i;

        for(i=1;i<=_numBackgrounds;i++)
        {
            $bgDic[i] = $doms.backgrounds.find(".bg-"+i+"");
        }

        setupTimeline();

        $doms.backgrounds.restart = function()
        {
            reset();

            var tl = new TimelineMax;
            tl.set($doms.backgrounds, {autoAlpha:0});
            tl.to($doms.backgrounds, _fadeDuration, {autoAlpha:1});

            $doms.backgrounds.playTL.restart();

            playContents_mobile();
        };

        $doms.backgrounds.stop = function()
        {
            $doms.backgrounds.playTL.pause();
        };


        function setupTimeline()
        {
            var tl = $doms.backgrounds.playTL = new TimelineMax({paused:true, repeat:-1});

            tl.add(function()
            {
                playOnce();
            }, _sceneDuration);
        }

        function playOnce()
        {
            //console.log("play once: " + _currentIndex);

            var oldIndex = _currentIndex;
            _currentIndex ++;
            if(_currentIndex > _numBackgrounds) _currentIndex = 1;

            var $oldBg = $bgDic[oldIndex],
                $newBg = $bgDic[_currentIndex];

            $doms.backgrounds.append($newBg);

            var tl = new TimelineMax;
            tl.set($newBg, {autoAlpha:0});
            tl.to($newBg, _fadeDuration, {autoAlpha:1, ease:Power1.easeIn});
            tl.add(function()
            {
                TweenMax.set($oldBg, {autoAlpha: 0});
            });

        }

        function reset()
        {
            _currentIndex = 1;

            for(var i=1; i<=_numBackgrounds;i++)
            {
                var $bg = $bgDic[i],
                    alpha = i == _currentIndex? 1: 0;
                TweenMax.set($bg, {autoAlpha:alpha});
            }
        }

    }

    function setupVideo()
    {
        if(_isVideoSet) return;
        _isVideoSet = true;

        $doms.video = $doms.container.find(".fullsize-video");

        var videoDom = $doms.video[0];

        $doms.video.restart = function()
        {
            $doms.video.toggleClass("playing-mode", false);
            videoDom.addEventListener("canplay", onFirstPlay);
            videoDom.load();
        };

        $doms.video.stop = function()
        {
            videoDom.pause();
        };

        function onFirstPlay()
        {
            //console.log('on first play');

            videoDom.removeEventListener("canplay", onFirstPlay);
            $doms.video.toggleClass("playing-mode", true);
            videoDom.play();

            playContents_pc();
        }
    }

    function show(cb)
    {
        $("#scene-container").append($doms.container);

        self.resize();

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