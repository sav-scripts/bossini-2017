(function ()
{
    var $doms = {},
        _isInit = false;

    var self = window.Publish =
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
                        {url: "_publish.html", startWeight: 0, weight: 100, dom: null}
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
            }
        }
    };

    function showContent()
    {
        var tl = new TimelineMax;
        tl.set($doms.container, {autoAlpha: 0});
        tl.to($doms.container, .4, {autoAlpha: 1});
    }


    function build(templates)
    {
        $("#invisible-container").append(templates[0].dom);
        $doms.container = $("#publish");


        $doms.container.detach();
    }

    function show(cb)
    {
        $("#scene-container").append($doms.container);

        self.resize(true);

        cb.apply();

        //var tl = new TimelineMax;
        //tl.set($doms.container, {autoAlpha: 0});
        //tl.to($doms.container, .4, {autoAlpha: 1});
        //tl.add(function ()
        //{
        //    cb.apply();
        //});
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