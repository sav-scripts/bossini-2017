(function ()
{
    var $doms = {},
        _pageSize = 10,
        _pageIndex = 0,
        _isInit = false;

    var self = window.Entries =
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
                        {url: "_entries.html", startWeight: 0, weight: 100, dom: null}
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

        }
    };


    function build(templates)
    {
        $("#invisible-container").append(templates[0].dom);
        $doms.container = $("#entries");


        $doms.container.detach();
    }

    function getEntries()
    {
        Loading.progress('').show();

        var formObj =
        {
            page_index: _pageIndex,
            page_size: _pageSize
        };

        ApiProxy.callApi("get_entries", formObj, true, function(response)
        {
            if(response.error)
            {
                alert(response.error);
            }
            else
            {
                console.log(response);
            }

            Loading.hide();
        });
    }

    function show(cb)
    {
        $("#scene-container").append($doms.container);

        self.resize();

        var tl = new TimelineMax;
        tl.set($doms.container, {autoAlpha: 0});
        tl.to($doms.container, .2, {autoAlpha: 1});
        tl.add(function ()
        {
            getEntries();
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