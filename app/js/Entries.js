(function ()
{
    var $doms = {},
        _settings =
        {
            '0':
            {
                pageSize: 9,
                ignoreBlockDic: {5:true,10:true,12:true,13:true,14:true,15:true}
            },
            '1':
            {
                pageSize: 14,
                ignoreBlockDic: {8:true}
            }
        },
        _pageIndex = 0,
        _pageSize,
        _numPages = null,
        _isInit = false,
        _viewportIndex,
        _thumbData,
        $activeThumbs,
        _isLocking = true;

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

        resize: function (isFromShow)
        {
            if(_isInit)
            {
                var oldViewportIndex = _viewportIndex,
                    vp = Main.viewport;

                _viewportIndex = vp.index;
                var isChanged = oldViewportIndex != _viewportIndex;

                if(isChanged || isFromShow)
                {
                    updatePageSetting(vp.index);
                }

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


    function build(templates)
    {
        $("#invisible-container").append(templates[0].dom);
        $doms.container = $("#entries");

        $doms.btnToPublish = $doms.container.find(".btn-to-publish").on(_CLICK_, function()
        {
            Main.loginFB('/Publish');
        });

        $doms.arrowLeft = $doms.container.find(".arrow-left").on(_CLICK_, function()
        {
            if(_isLocking) return;

            if(_pageIndex > 0)
            {
                toPage(_pageIndex-1);
            }
        });

        $doms.arrowRight = $doms.container.find(".arrow-right").on(_CLICK_, function()
        {
            if(_isLocking) return;

            if(_numPages && _pageIndex < (_numPages-1))
            {
                toPage(_pageIndex+1);
            }

        });

        $doms.thumbContainer = $doms.container.find(".thumb-container");

        $doms.thumbs = $doms.thumbContainer.find(".thumb");

        self.ShowEntry.init();

        $doms.container.detach();
    }

    function updatePageSetting(viewportIndex)
    {
        $activeThumbs = [];

        var setting = _settings[viewportIndex];

        _pageSize = setting.pageSize;

        var i, $thumb;
        for(i=1;i<=$doms.thumbs.length;i++)
        {
            $thumb = $($doms.thumbs[i-1]);

            if(setting.ignoreBlockDic[i])
            {
                $thumb.toggleClass("ignore-mode", true);
            }
            else
            {
                $activeThumbs.push($thumb);
                $thumb.toggleClass("ignore-mode", false);
            }
        }

        hideThumbs(null, 0, 0);
        toPage(0);
    }

    function toPage(index)
    {
        _pageIndex = index;

        getEntries(_pageIndex, _pageSize);

    }

    function getEntries(pageIndex, pageSize)
    {
        Loading.progress('empty').show();

        _isLocking = true;
        updateArrows();

        var formObj =
        {
            page_index: pageIndex,
            page_size: pageSize
        };

        ApiProxy.callApi("get_entries", formObj, true, function(response)
        {
            if(response.error)
            {
                alert(response.error);
            }
            else
            {
                _numPages = response.num_pages;
                _thumbData = response.data;

                hideThumbs(function()
                {
                    showThumbs(function()
                    {
                        _isLocking = false;
                        updateArrows();
                    });
                });
            }

            Loading.hide();
        });
    }

    function updateArrows()
    {
        if(_isLocking)
        {
            $doms.arrowLeft.toggleClass("hide-mode", true);
            $doms.arrowRight.toggleClass("hide-mode", true);
        }
        else
        {
            $doms.arrowLeft.toggleClass("hide-mode", _pageIndex == 0 || _numPages == 0);
            $doms.arrowRight.toggleClass("hide-mode", !_numPages || _pageIndex == (_numPages-1));
        }
    }

    function showThumbs(cb)
    {
        var i, tl, delay = 0;

        tl = new TimelineMax;


        for(i=0;i<$activeThumbs.length;i++)
        {
            if(setupThumb(i, tl, delay)) delay += .05;;
        }

        if(cb) tl.add(cb);
    }

    function setupThumb(index, tl, delay)
    {

        var $thumb = $activeThumbs[index],
            obj = _thumbData[index];

        if(!obj)
        {
            $thumb.toggleClass("ignore-mode", true);
            $thumb.unbind(_CLICK_);

            return false;
        }
        else
        {
            $thumb.toggleClass("ignore-mode", false).
                css("background-image", "url("+obj.thumb_url+")").
                on(_CLICK_, function()
                {
                    self.ShowEntry.show(obj.url);
                });


            tl.to($thumb,.4,{alpha:1}, delay);

            return true;
        }
    }

    function hideThumbs(cb, duration, delay)
    {
        var i, $thumb, tl;

        if(duration === undefined) duration = .4;
        if(delay === undefined) delay = .05;


        tl = new TimelineMax();

        for(i=0;i<$activeThumbs.length;i++)
        {
            $thumb = $activeThumbs[i];
            tl.to($thumb,duration,{alpha:0}, i *delay);
        }

        if(cb) tl.add(cb);
    }

    function show(cb)
    {
        $("#scene-container").append($doms.container);

        self.resize(true);
        $("#background").find(".cover").toggleClass('entries-mode', true);

        cb.apply();
    }

    function showContent()
    {
        var tl = new TimelineMax;
        tl.set($doms.container, {autoAlpha: 0});
        tl.to($doms.container, .2, {autoAlpha: 1});
    }

    function hide(cb)
    {
        self.ShowEntry.hide();

        var tl = new TimelineMax;
        tl.to($doms.container, .4, {autoAlpha: 0});
        tl.add(function ()
        {
            $("#background").find(".cover").toggleClass('entries-mode', false);

            $doms.container.detach();
            cb.apply();
        });
    }

}());