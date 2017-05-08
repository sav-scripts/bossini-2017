(function ()
{
    var $doms = {},
        _videoDic =
        {
            "1":
            {
                'id': 'PWRj1ub6AnI',
                'title':'bossini形象影片'
            },
            "2":
            {
                'id': '9kiXn5SBDoI',
                'title':'陳庭妮 篇'
            },
            "3":
            {
                'id': 'prxs-bE8Cpg',
                'title':'HH 先生 篇'
            },
            "4":
            {
                'id': '',
                'title':'Peter Su 篇'
            },
            "5":
            {
                'id': '',
                'title':'為你的衣櫃添新衣',
                'link': 'https://www.bossini.com.tw/'
            },
            "6":
            {
                'id': '',
                'title':'加入VIP 回饋不停止',
                'link': 'http://www.bossini.com.tw/zh_TW/VIP.html'
            }
        },
        _isInit = false,
        _isPlayerReady = false,
        _player,
        _currentIndex = 1;

    var self = window.Videos =
    {
        getVideoDic: function()
        {
            return _videoDic;
        },

        setPlayingIndex: function(index)
        {
            _currentIndex = index;
        },

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
                        {url: "_videos.html", startWeight: 0, weight: 100, dom: null}
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


    function build(templates)
    {
        $("#invisible-container").append(templates[0].dom);
        $doms.container = $("#videos");

        $doms.videoContainer = $doms.container.find(".video-container");

        $doms.thumbContainer = $doms.container.find(".thumb-container");

        setupThumbs();

        initYouTube();

        updateThumbs();

        $doms.container.detach();
    }

    function initYouTube()
    {
        // Load the IFrame Player API code asynchronously.
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/player_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        // Replace the 'ytplayer' element with an <iframe> and
        // YouTube player after the API code downloads.



        window.onYouTubePlayerAPIReady = function()
        {
            _isPlayerReady = true;
            playVideo(_currentIndex);
        };
    }
    function playVideo(index)
    {
        if(!_isPlayerReady) return;

        if(_videoDic[index].id == '')
        {
            alert('影片尚未開放，敬請期待');
            return;
        }

        _currentIndex = index;

        updateThumbs();

        if(_player) _player.destroy();

        //console.log("check: " + _currentIndex);

        _player = new YT.Player('ytplayer', {

            videoId: _videoDic[_currentIndex].id,

            playerVars:
            {
                'autoplay': 1,
                'controls': 0
            }
        });
    }

    function playVideo_old(index)
    {
        if(!_isPlayerReady) return;

        if(_videoDic[index].id == '')
        {
            alert('影片尚未開放，敬請期待');
            return;
        }

        _currentIndex = index;

        updateThumbs();


        _player.loadVideoById
        ({
            videoId: _videoDic[_currentIndex].id
        });
    }

    function updateThumbs()
    {
        $doms.thumbs.toggleClass("focus-mode", false);
        $doms.thumbDic[_currentIndex].toggleClass('focus-mode', true);
    }

    function setupThumbs()
    {
        $doms.thumbs = $doms.container.find('.thumb');

        $doms.thumbDic = {};

        for(var i=1;i<=6;i++) { setupOne(i); }

        function setupOne(index)
        {
            var $thumb = $doms.thumbDic[index] = $doms.thumbContainer.find(".thumb:nth-child("+index+")"),
                $desc = $thumb.find(".desc"),
                dataObj = _videoDic[index];

            $desc.text(dataObj.title);

            $thumb.on(_CLICK_, function()
            {
                ga('send', 'event', '影片', '影片選擇', dataObj.title);

                if(dataObj.link)
                {
                    window.open(dataObj.link, '_blank');
                }
                else
                {
                    //if(_currentIndex == index) return;
                    playVideo(index);
                }
            });

        }
    }

    function show(cb)
    {
        $("#scene-container").append($doms.container);

        ga('send', 'pageview', '影片');

        self.resize(true);

        cb.apply();
    }

    function showContent()
    {
        var tl = new TimelineMax;
        tl.set($doms.container, {autoAlpha: 0});
        tl.to($doms.container, .4, {autoAlpha: 1});

        if(_isPlayerReady) playVideo(_currentIndex);
    }

    function hide(cb)
    {
        var tl = new TimelineMax;
        tl.to($doms.container, .4, {autoAlpha: 0});
        tl.add(function ()
        {
            //_isPlayerReady = false;

            if(_player)
            {
                _player.destroy();
                _player = null;
            }
            $doms.container.detach();
            cb.apply();
        });
    }

}());