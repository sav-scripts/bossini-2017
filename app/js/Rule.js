(function ()
{
    var $doms = {},
        _ss,
        _isInit = false;

    var self = window.Rule =
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
                        {url: "_rule.html", startWeight: 0, weight: 100, dom: null}
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
                    TweenMax.set($doms.container, {autoAlpha:0});
                }
                else if(isFromShow)
                {
                    showContent();
                }

                var vp = Main.viewport;

                if(vp.changed)
                {
                    //var scrollBarSize = vp.index == 0? 101: 101;
                    var scrollBarSize = 126;

                    var containerHeight = $doms.contentContainer.height();
                    //var $ssContainer = $(_ss.doms.container);

                    //var offsetX = vp.index == 0? 540: 769;
                    var offsetX = parseInt($doms.scrollbase.css('left')) - parseInt($doms.contentContainer.css('left'));

                    //_ss.containerSize(null, containerHeight).scrollBound(containerWidth+10, 3, 0, containerHeight-scrollBarSize).update(true);
                    //_ss.containerSize(null, containerHeight).scrollBound(offsetX, 0, 0, containerHeight-scrollBarSize).update(true);
                    _ss.containerSize(null, containerHeight).scrollBound(offsetX, 0, 0, containerHeight-scrollBarSize).update(true);
                }
            }
        }
    };


    function build(templates)
    {
        $("#invisible-container").append(templates[0].dom);
        $doms.container = $("#rule");

        $doms.contentContainer = $doms.container.find(".content-container");
        $doms.scrollbase = $doms.container.find(".scroll-base");

        _ss = new SimpleScroller($doms.contentContainer[0], null, 0, Modernizr.touchevents).update(true);

        $doms.container.detach();
    }

    function show(cb)
    {
        $("#scene-container").append($doms.container);

        self.resize(true);

        cb.apply();
    }

    function showContent()
    {
        var tl = new TimelineMax;
        tl.set($doms.container, {autoAlpha: 0});
        tl.to($doms.container, .3, {autoAlpha: 1});

        tl.set($doms.container, {transformPerspective: 600, marginLeft: 0, transformOrigin: 'center center', rotationY:-70, scale:.2}, 0);

        tl.to($doms.container, 1, {rotationY: 0, scale: 1, ease:Power1.easeInOut}, 0);

        tl.add(function()
        {
            $doms.container.css('transform', 'none');
        });
    }

    function hide(cb)
    {
        var tl = new TimelineMax;

        tl.set($doms.container, {transformPerspective: 900, transformOrigin: 'center center'});
        tl.to($doms.container,1, {rotationY: 90, scale:.2, marginLeft: 400, ease:Power1.easeIn});
        //tl.to($doms.container,.5, {marginLeft: 200, ease:Power1.easeInOut});

        tl.to($doms.container, .3, {autoAlpha: 0}, "-=.3");
        tl.add(function ()
        {
            $doms.container.detach();
            cb.apply();
        });
    }

}());